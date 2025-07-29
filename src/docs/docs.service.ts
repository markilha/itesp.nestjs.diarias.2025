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
    try {
      const objectKey = `SQE_${SQE_ID_CODIGO}/comprovante.pdf`;

      const result = this.obsClient.createSignedUrlSync({
        Method: 'GET',
        Bucket: 'itesp-ccp',
        Key: objectKey,
        Expires: 3600,
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
    const tempFilePath = path.join(tempDir, 'comprovante.pdf');
    fs.writeFileSync(tempFilePath, file.buffer);
    const fileStream = fs.createReadStream(tempFilePath);

    const bucketName = 'itesp-ccp';
    const objectKey = `SQE_${SQE_ID_CODIGO}/comprovante.pdf`;

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
