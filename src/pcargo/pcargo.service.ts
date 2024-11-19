import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PcargoEntity } from '../database/db_oracle/entities/pcargo.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, PcargoDto, PcargoDtoCreate, PcargoDtoUpdate } from './pcargoDto';

@Injectable()
export class PcargoService {
  constructor(
    @InjectRepository(PcargoEntity, 'oracleConnection')
    private pcargoRepository: Repository<PcargoEntity>,
  ) {}

  //create
  async create(pcargoDto: PcargoDtoCreate): Promise<PcargoDto> {
    try {
      return await this.pcargoRepository.save(this.pcargoRepository.create(pcargoDto));
    } catch (error) {
      throw new HttpException('Não foi possível criar o cargo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAll(params: FindAllParams): Promise<PcargoDto[]> {
    try {   
     
      const searchParams: FindOptionsWhere<PcargoDto> = {};  
     
      if (params.codigo) {
        searchParams['codigo'] = params.codigo;
      }
  
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;  
     
        return await this.pcargoRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }
  
      
      return await this.pcargoRepository.find({
        where: searchParams,
      });

    } catch (error) {
      throw new HttpException('Não foi possível buscar cargos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async findOne(codigo: string) {
    try {
      return await this.pcargoRepository.findOneOrFail({
        where: { codigo: codigo },
      });
    } catch (error) {
      throw new HttpException('Cargo não encontrado', HttpStatus.NOT_FOUND);
    }
  }
  //update
  async update(pcargoDto: PcargoDtoUpdate): Promise<PcargoDto> {

      const pcargo = await this.findOne(pcargoDto.codigo);
      this.pcargoRepository.merge(pcargo, pcargoDto);
      return await this.pcargoRepository.save(pcargo);
   
  }

  async delete(codigo: string) {
    await this.findOne(codigo);
    await this.pcargoRepository.delete({ codigo: codigo });
  }
}
