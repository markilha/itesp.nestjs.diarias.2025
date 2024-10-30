import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extornoEntity } from 'src/database/db_oracle/entities/extorno.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, extornoDto,  upateExtornoDto } from './extornoDto';

@Injectable()
export class extornoService {
  constructor(
    @InjectRepository(extornoEntity, 'oracleConnection')
    private extornoRepository: Repository<extornoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<extornoDto[]> {
    try {
      const searchParams: FindOptionsWhere<extornoDto> = {};
      if (params.SQE_ID_CODIGO) {
        searchParams['SQE_ID_CODIGO'] = params.SQE_ID_CODIGO;
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.extornoRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.extornoRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível buscar os extornos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(SQE_ID_CODIGO: number): Promise<extornoDto> {
    try {
      const result = await this.extornoRepository.findOne({
        where: {
          SQE_ID_CODIGO,
        },
      });
      if (!result) {
        throw new HttpException('Extorno não encontrado', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {  
    
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(extorno: extornoDto): Promise<extornoDto> {
    try {
      //extorno já existe
      const existeExtorno = await this.extornoRepository.findOne({
        where: { SQE_ID_CODIGO: extorno.SQE_ID_CODIGO, PCO_ID_CODIGO: extorno.PCO_ID_CODIGO },
      });
      if (existeExtorno) {
        throw new HttpException('Extorno já existe', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return await this.extornoRepository.save(extorno);
    } catch (error) {  
      console.log(error);    
      throw new HttpException(
        'Não foi possível criar o extorno',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(ex: upateExtornoDto): Promise<{ message: string }> {
    try {      
      const codigo = Number(ex.SQE_ID_CODIGO);
      const pcoCodigo = Number(ex.PCO_ID_CODIGO); 
      const existeExist = await this.extornoRepository.findOne({
        where: { SQE_ID_CODIGO: codigo, PCO_ID_CODIGO: pcoCodigo },
      });      
      
      if (!existeExist) {
        throw new HttpException('Extorno não encontrado', HttpStatus.NOT_FOUND);
      }  
  
      const dados = {  
        FPA_ID_CODIGO: ex.FPA_ID_CODIGO,
        EXT_VALOR: ex.EXT_VALOR,
        EXT_DATA: ex.EXT_DATA,
        EXT_JUSTIFICA: ex.EXT_JUSTIFICA       
      };
      console.log(dados);
  
      await this.extornoRepository.update({ SQE_ID_CODIGO: codigo, PCO_ID_CODIGO: pcoCodigo }, dados);
  
      return { message: 'Atualizado com sucesso!!!' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
}
