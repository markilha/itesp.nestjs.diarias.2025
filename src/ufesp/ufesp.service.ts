import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UferpsEntity } from 'src/database/db_oracle/entities/UferpsEntity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UfespDto } from './ufespDto';

@Injectable()
export class UfespService {
  constructor(
    @InjectRepository(UferpsEntity, 'oracleConnection')
    private uferpsRepository: Repository<UferpsEntity>,
  ) {}

  async create(createUferpsvalorDto: UfespDto): Promise<UfespDto> {
    try {
      const uferpsvalor = this.uferpsRepository.create(createUferpsvalorDto);
      return this.uferpsRepository.save(uferpsvalor);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao criar a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateUferpsvalorDto: UfespDto): Promise<UferpsEntity> {
    try {
      await this.uferpsRepository.update(id, updateUferpsvalorDto);
      return this.uferpsRepository.findOneBy({ ufeIdCodigo: id });
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao atualizar a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.uferpsRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao remover a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(params: FindAllParams): Promise<UfespDto[]> {
    const searchParams: FindOptionsWhere<UferpsEntity> = {};

    if (params.ufeIdCodigo) {
      searchParams['ufeIdCodigo'] = params.ufeIdCodigo;
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      return await this.uferpsRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.uferpsRepository.find({
      where: searchParams,
    });
  }

  // Novo método para encontrar o valor mais atual
  async findMostRecentValue(): Promise<UfespDto | undefined> {
    return this.uferpsRepository
      .createQueryBuilder('u')
      .orderBy('u.ufeDtFinal', 'DESC')
      .addOrderBy('u.ufeDtInicio', 'DESC')
      .getOne();
  }

  // Inserir uma data e retornar o valor da UFESP naquela data

  async findValueByDate(dateString: string): Promise<UfespDto | null> {
    const date = new Date(dateString);

    // Tenta encontrar o valor correspondente à data utilizando BETWEEN
    let result = await this.uferpsRepository
      .createQueryBuilder('u')
      .where(':date BETWEEN u.ufeDtInicio AND u.ufeDtFinal', { date }) // Utiliza BETWEEN para simplificar
      .getOne();

    // Se não encontrar, busca o valor anterior à data
    if (!result) {
      result = await this.uferpsRepository
        .createQueryBuilder('u')
        .where('u.ufeDtFinal < :date', { date }) // Reutiliza o mesmo valor
        .orderBy('u.ufeDtFinal', 'DESC')
        .getOne();
    }

    return result;
}

}
