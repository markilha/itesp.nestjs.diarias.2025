import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { docsEntity } from '../database/db_mysql/entities/docs.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams } from './documento.dto';

@Injectable()
export class documentosService {
  constructor(
    @InjectRepository(docsEntity, 'mysqlConnection')
    private documentosRepository: Repository<docsEntity>,
  ) {}

  async create(documentoDTO: docsEntity): Promise<docsEntity> {
    const createdocumento = await this.documentosRepository.save(documentoDTO);
    return createdocumento;
  }

  async findAll(params: FindAllParams): Promise<docsEntity[]> {
    const searchParams: FindOptionsWhere<docsEntity> = {};

    if (params.NOME_DOCUMENTO) {
      searchParams.NOME_DOCUMENTO = ILike(`%${params.NOME_DOCUMENTO}%`);
    }
    if (params.SQE_ID_CODIGO) {
      searchParams.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
    }

    const documentos = await this.documentosRepository.find({ where: searchParams });
    return documentos;
  }

  async findOne(ID_DOC: number): Promise<docsEntity> {
    try {
      const documento = await this.documentosRepository.findOneOrFail({ where: { ID_DOC } });
      return documento;
    } catch (error) {
      throw new HttpException('Documento não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  //find by SQE_ID_CODIGO
  async findBySQE_ID_CODIGO(SQE_ID_CODIGO: number): Promise<docsEntity[]> {
    try {
      const documento = await this.documentosRepository.find({ where: { SQE_ID_CODIGO } });
      if (documento.length === 0) {
        throw new HttpException('Documento não encontrado', HttpStatus.NOT_FOUND);
      }
      return documento;
    } catch (error) {
      throw new HttpException('Documento não encontrado', HttpStatus.NOT_FOUND);
    }
  }
  //find by NOME_DOCUMENTO
  async findByNomeDocumento(NOME_DOCUMENTO: string): Promise<docsEntity> {
    try {
      const documento = await this.documentosRepository.findOneOrFail({
        where: { NOME_DOCUMENTO },
      });
      return documento;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Documento não encotrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async deleteBySQE_ID_CODIGO(SQE_ID_CODIGO: number) {
    try {
      await this.findBySQE_ID_CODIGO(SQE_ID_CODIGO);
      await this.documentosRepository.delete({ SQE_ID_CODIGO });
    } catch (error) {
      throw new HttpException('Documento não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
