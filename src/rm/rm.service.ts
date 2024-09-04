import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoa } from 'src/db_rm/entities/rm.entity';
import { pFunc } from 'src/db_rm/entities/pfunc.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, RMPessoaDto } from './rm.dto';

@Injectable()
export class RmService {
  constructor(
    @InjectRepository(PPessoa, 'db_rm')
    private rmRepository: Repository<PPessoa>,
    @InjectRepository(pFunc, 'db_rm')
    private funcRepository: Repository<pFunc>,
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
    
    return await this.rmRepository.find({
      where: searchParams,
    });
  }

  async findPessoaWithFunc(params: FindAllParams): Promise<RMPessoaDto[]> {
    const searchParams: FindOptionsWhere<PPessoa> = {};  
    if (params.nome) {
      searchParams['nome'] = ILike(`%${params.nome}%`);
    }
  
    const queryBuilder = this.rmRepository
      .createQueryBuilder('pessoa')
      .innerJoinAndSelect(pFunc, 'func', 'pessoa.codusuario = func.CHAPA');
  
    // Adiciona filtros ao queryBuilder
    if (params.nome) {
      queryBuilder.andWhere('UPPER(pessoa.nome) LIKE UPPER(:nome)', {
        nome: `%${params.nome}%`,
      });
    }  
    
    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;      
      queryBuilder.skip(skip).take(limit);
    }
  
 
    try {
      // console.log(queryBuilder.getSql()); // Verifica a consulta SQL gerada
      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      throw new Error('Erro ao executar a consulta.');
    }
  }
  
  
  async findAllFuncs(): Promise<pFunc[]> {
    return this.funcRepository.find();
  }
}
