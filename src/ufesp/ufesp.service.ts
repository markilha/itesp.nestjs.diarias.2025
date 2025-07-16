/* istanbul ignore file */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UfespEntity } from '../database/db_oracle/entities/UfespEntity';
import { In, Repository } from 'typeorm';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';
import { CreateUfespDto } from './dto/create-ufesp.dto';
import { UpdateUfespDto } from './dto/update-ufesp.dto';
import { UfespParamsDto } from './dto/ufesp-params.dto';
import { UfespDto } from './dto/ufesp.dto';

@Injectable()
export class UfespService {

  constructor(
    @InjectRepository(UfespEntity, 'oracleConnection')
    private repository: Repository<UfespEntity>,
  ) {}

  async findAll(params: UfespParamsDto): Promise<[number, UfespEntity[]]> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 500;

    const startRow = (page - 1) * limit + 1;
    const endRow = page * limit;

    const query = this.repository
      .createQueryBuilder('r')
      .select([
        'r.UFE_ID_CODIGO as "ufeIdCodigo"',
        'r.TDE_ID_CODIGO as "tdeIdCodigo"',
        'r.UFE_VALOR as "ufeValor"',
        'r.UFE_DTINICIO as "ufeDtInicio"',
        'r.UFE_DTFINAL as "ufeDtFinal"',
      ])
      .orderBy('r.UFE_DTINICIO', 'ASC');

    const paginatedQuery = getPaginatedQuery(query, startRow, endRow);
    const entities: Array<UfespEntity & { TOTAL_COUNT: number }> =
      await this.repository.query(paginatedQuery);

    return [entities[0].TOTAL_COUNT, entities.map((entity) => new UfespEntity(entity))];
  }

  async findOne(id: number): Promise<UfespEntity> {
    const entity = await this.repository.findBy({
      ufeIdCodigo: id,
    });

    if (!entity[0]) throw new NotFoundException('UFESP nao encontrada');

    return entity[0];
  }

  async create(payload: CreateUfespDto): Promise<UfespEntity> {
    const entity = new UfespEntity(payload);

    if (entity.ufeDtFinal < entity.ufeDtInicio)
      throw new BadRequestException('A data final não pode ser menor que a data de inicio');

    const existing = await this.repository
      .createQueryBuilder('ufe')
      .where(':date BETWEEN ufe.ufeDtInicio AND ufe.ufeDtFinal', { date: entity.ufeDtInicio })
      .orWhere(':date BETWEEN ufe.ufeDtInicio AND ufe.ufeDtFinal', { date: entity.ufeDtFinal })
      .getOne();

    if (existing) throw new ConflictException('Ja existe um UFESP com a data de inicio ou final');

    return this.repository.save(entity);
  }

  async update(id: number, payload: UpdateUfespDto): Promise<UfespEntity> {
    const current = await this.findOne(id);

    if (!current) throw new NotFoundException('UFESP nao encontrada');

    const entity = new UfespEntity({
      ...current,
      ...payload,
    });

    if (entity.ufeDtFinal < entity.ufeDtInicio)
      throw new BadRequestException('A data final não pode ser menor que a data de inicio');

    const existing = await this.repository
      .createQueryBuilder('ufe')
      .where(
        "(TO_DATE(:startDate, 'YYYY-MM-DD') BETWEEN ufe.ufeDtInicio AND ufe.ufeDtFinal OR TO_DATE(:endDate, 'YYYY-MM-DD') BETWEEN ufe.ufeDtInicio AND ufe.ufeDtFinal)",
        {
          startDate: entity.ufeDtInicio,
          endDate: entity.ufeDtFinal,
        },
      )
      .andWhere('ufe.UFE_ID_CODIGO != :id', { id })
      .getOne();

    if (existing) throw new ConflictException('Ja existe um UFESP com a data de inicio ou final');

    return this.repository.save(entity);
  }

  async remove(id: number): Promise<UfespEntity> {
    const entity = await this.repository.find({
      where: { ufeIdCodigo: id },
    });

    if (!entity[0]) throw new NotFoundException('UFESP não encontrada');

    return await this.repository.remove(entity[0]);
  }

  async removeVarios(ids: number[]): Promise<UfespEntity[]> {
    const entities = await this.repository.find({
      where: {
        ufeIdCodigo: In(ids),
      },
    });

    return await this.repository.remove(entities);
  }

  async getLast(): Promise<UfespEntity> {
    const entity = await this.repository
      .find({ order: { ufeDtFinal: 'DESC' } })
      .then((entities) => entities[0]);

    if (!entity) throw new NotFoundException('Nenhuma UFESP encontrada');

    return entity;
  }

  async findValueByDate(dateString: string | Date): Promise<UfespDto | null> {
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);

      let result = await this.repository
        .createQueryBuilder('u')
        .where(':date BETWEEN u.ufeDtInicio AND u.ufeDtFinal', { date }) // Utiliza BETWEEN para simplificar
        .getOne();

      // Se não encontrar, busca o valor anterior à data
      if (!result) {
        result = await this.repository
          .createQueryBuilder('u')
          .where('u.ufeDtFinal < :date', { date }) // Reutiliza o mesmo valor
          .orderBy('u.ufeDtFinal', 'DESC')
          .getOne();
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao buscar a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
