import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FileDto } from './docs.Dto';
import { documentosService } from '../documentos/documento.service';

import * as OBS from 'esdk-obs-nodejs';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class docsService {
  private obsClient: OBS;

  constructor(@Inject(documentosService) private readonly documentosService: documentosService) {
    this.obsClient = new OBS({
      access_key_id: process.env.ACCES_KEY_ID,
      secret_access_key: process.env.SECRET_ACCESS_KEY,
      server: process.env.SERVER,
    });
  }

  async getDocumentLink(SQE_ID_CODIGO: number) {
    const bucketName = process.env.OBS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('OBS_BUCKET_NAME não definida no .env');
    }
    const folder = `SQE_${SQE_ID_CODIGO}`;
    const extensoes = ['.pdf', '.png', '.jpg'];

    for (const ext of extensoes) {
      const objectKey = `${folder}/comprovante${ext}`;
      try {
        // Tenta gerar URL assinada
        const result = this.obsClient.createSignedUrlSync({
          Method: 'GET',
          Bucket: bucketName,
          Key: objectKey,
          Expires: 3600, // 1 hora
        });

        // Se conseguiu, retorna a URL
        return { url: result.SignedUrl };
      } catch (err) {
        if (err.code !== 'NoSuchKey') {
          console.error(`Erro ao buscar o arquivo: ${objectKey}`, err);
        }
      }
    }

    // Se não achou nenhuma das extensões
    throw new HttpException('Arquivo do comprovante não encontrado', HttpStatus.NOT_FOUND);
  }

  async getDocumentName(SQE_ID_CODIGO: number): Promise<{ nome: string }> {
    const bucketName = process.env.OBS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('OBS_BUCKET_NAME não definida no .env');
    }
    const folder = `SQE_${SQE_ID_CODIGO}`;
    const extensoes = ['.pdf', '.png', '.jpg'];

    for (const ext of extensoes) {
      const objectKey = `${folder}/comprovante${ext}`;
      try {
        // Verifica se o objeto existe consultando os metadados
        await this.obsClient.getObjectMetadata({
          Bucket: bucketName,
          Key: objectKey,
        });

        return { nome: `comprovante${ext}` };
      } catch (err) {
        if (err.code !== 'NoSuchKey') {
          console.error(`Erro ao buscar o arquivo: ${objectKey}`, err);
        }
      }
    }

    throw new HttpException('Arquivo do comprovante não encontrado', HttpStatus.NOT_FOUND);
  }

  async docsToOBS(file: FileDto, SQE_ID_CODIGO: number) {
    const bucketName = process.env.OBS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('OBS_BUCKET_NAME não definida no .env');
    }
    const extensaoPermitida = ['.pdf', '.png', '.jpg', '.jpeg'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (!extensaoPermitida.includes(fileExt)) {
      throw new Error('Extensão de arquivo não suportada. Envie PDF, PNG ou JPG.');
    }

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `comprovante${fileExt}`);
    fs.writeFileSync(tempFilePath, file.buffer);
    const fileStream = fs.createReadStream(tempFilePath);

    const folder = `SQE_${SQE_ID_CODIGO}`;
    const objectKey = `${folder}/comprovante${fileExt}`;

    // Deleta os arquivos antigos (pdf, png, jpg)
    const extensoes = ['.pdf', '.png', '.jpg'];
    for (const ext of extensoes) {
      const oldKey = `${folder}/comprovante${ext}`;
      try {
        await this.obsClient.deleteObject({ Bucket: bucketName, Key: oldKey });
      } catch (err) {
        // Se o arquivo não existir, apenas ignora o erro
        if (err.code !== 'NoSuchKey') {
          console.error(`Erro ao tentar deletar ${oldKey}`, err);
        }
      }
    }

    return new Promise((resolve, reject) => {
      this.obsClient.putObject(
        {
          Bucket: bucketName,
          Key: objectKey,
          Body: fileStream,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }
}
