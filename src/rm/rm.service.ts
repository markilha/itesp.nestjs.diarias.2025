import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoa } from 'src/db_rm/entities/rm.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, RMPessoaDto } from './rm.dto';

@Injectable()
export class RmService {
    constructor(
        @InjectRepository(PPessoa, 'db_rm')
        private rmRepository: Repository<PPessoa>,
    ) {}

    
    async findAll(params: FindAllParams): Promise<RMPessoaDto[]> {
        const searchParams: FindOptionsWhere<RMPessoaDto> = {};
    
        if (params.nome) {
          searchParams['nome'] = ILike(`%${params.nome}%`);
        }
     
    
        // Verifica se os parâmetros page e limit foram fornecidos
        if (params.page && params.limit) {
          const page = params.page;
          const limit = params.limit;
          const skip = (page - 1) * limit;
          // Retorna os registros paginados
          return await this.rmRepository.find({
            where: searchParams,
            skip,
            take: limit,
          });
        }
    
        // Se page e limit não forem fornecidos, retorna todos os registros
        return await this.rmRepository.find({
          where: searchParams,
        });
      }
}
