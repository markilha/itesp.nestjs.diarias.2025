import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FileDto } from './docs.Dto';
import { documentosService } from 'src/documentos/documento.service';

import * as OBS from 'esdk-obs-nodejs';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { generateUniqueFileName } from 'src/util/nomearArquivo';

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

  async getDocumentLink(id: number) {
    try {
      const doc = await this.documentosService.findOne(id);
      const fullKey = `${doc.SQE_ID_CODIGO}/${doc.NOME_DOCUMENTO}`;
      const result = this.obsClient.createSignedUrlSync({
        Method: 'GET',
        Bucket: 'itesp-ccp',
        Key: fullKey,
        Expires: 3600, // Expiração da URL (1 hora neste caso)
        ResponseContentDisposition: 'inline', // Exibe o arquivo diretamente no navegador
        ResponseContentType: 'application/pdf', // Tipo de conteúdo para PDF
      });

      // Retorna a URL gerada
      return { url: result.SignedUrl };
    } catch (err) {
      console.error(err);
      throw new HttpException('Erro ao gerar URL do arquivo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async docsToOBS(file: FileDto, SQE_ID_CODIGO: number) {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);
    const fileStream = fs.createReadStream(tempFilePath);

    const bucketName = 'itesp-ccp';
    const nomeArquivo = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const nomeArquivoFinal = generateUniqueFileName(nomeArquivo, SQE_ID_CODIGO);
    const objectKey = `${SQE_ID_CODIGO}/${nomeArquivoFinal}`;

    const dados = {
      NOME_DOCUMENTO: nomeArquivoFinal,
      SQE_ID_CODIGO,
      ORIGINAL_NAME: nomeArquivo,
    };

    let existe = [];

    try {      
      existe = await this.documentosService.findBySQE_ID_CODIGO(SQE_ID_CODIGO);
    } catch (error) {
      console.log('Documento não encontrado');      
    }


    if (existe.length > 0) {
      throw new HttpException('Comprovante já enviado para este saque', HttpStatus.CONFLICT);
    }

    await this.documentosService.create(dados);

    return new Promise((resolve, reject) => {
      this.obsClient.putObject(
        {
          Bucket: bucketName,
          Key: objectKey,
          Body: fileStream,
          ContentType: 'application/pdf',
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
