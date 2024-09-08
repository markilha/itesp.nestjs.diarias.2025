import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPessoaEntity } from 'src/database/db_oracle/entities/ppessoa.entity';
import { pFunc } from 'src/database/db_oracle/entities/pfunc.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams, RMPessoaDto } from './rm.dto';
import { returnRmDto } from './returnRmDto';

@Injectable()
export class RmService {
  constructor(
    @InjectRepository(PPessoaEntity)
    private rmRepository: Repository<PPessoaEntity>,
    @InjectRepository(pFunc)
    private funcRepository: Repository<pFunc>,
  ) {}

  async findAll(params: FindAllParams): Promise<returnRmDto[]> {
    const searchParams: FindOptionsWhere<RMPessoaDto> = {};

    if (params.nome) {
      searchParams['nome'] = ILike(`%${params.nome}%`);
    }

    let rms;

    // Verifica se os parâmetros page e limit foram fornecidos
    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;
      // Retorna os registros paginados
      rms = await this.rmRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    } else {
      rms = await this.rmRepository.find({
        where: searchParams,
      });
    }

    return rms.map((rm) => new returnRmDto(rm));
  }

  async findPessoaWithFunc(params: FindAllParams): Promise<RMPessoaDto[]> {
    const searchParams: FindOptionsWhere<PPessoaEntity> = {};
    if (params.nome) {
      searchParams['nome'] = ILike(`%${params.nome}%`);
    }

    const queryBuilder = this.rmRepository
      .createQueryBuilder('pessoa')
      .innerJoinAndSelect('pFunc', 'func', 'pessoa.codusuario = func.CHAPA');

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
