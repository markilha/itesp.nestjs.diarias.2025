import { ApiProperty } from '@nestjs/swagger';
import { PPessoaEntity } from 'src/database/db_mysql/entities/ppessoa.entity';

export class returnRmDto {
  codigo: number;
  codusuario?: string;
  nome?: string;
  dtnascimento?: Date;
  estadocivil?: string;
  sexo?: string;
  nacionalidade?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  estado?: string;
  cidade?: string;
  cep?: string;
  cpf?: string;
  telefone1?: string;
  cartidentidade?: string;
  ufcartident?: string;
  orgemissorident?: string;
  naturalidade?: string;
  datachegada?: Date;
  email?: string;
  codprofissao?: number;
  codocupacao?: string;
  salario?: number;
  CODFUNCAO?: string;

  constructor(rmEntity: PPessoaEntity) {
    this.codigo = rmEntity.codigo;
    this.codusuario = rmEntity.codusuario;
    this.nome = rmEntity.nome;
    this.dtnascimento = rmEntity.dtnascimento;
    this.estadocivil = rmEntity.estadocivil;
    this.sexo = rmEntity.sexo;
    this.nacionalidade = rmEntity.nacionalidade;
    this.rua = rmEntity.rua;
    this.numero = rmEntity.numero;
    this.complemento = rmEntity.complemento;
    this.bairro = rmEntity.bairro;
    this.estado = rmEntity.estado;
    this.cidade = rmEntity.cidade;
    this.cep = rmEntity.cep;
    this.cpf = rmEntity.cpf;
    this.telefone1 = rmEntity.telefone1;
    this.cartidentidade = rmEntity.cartidentidade;
    this.ufcartident = rmEntity.ufcartident;
    this.orgemissorident = rmEntity.orgemissorident;
    this.naturalidade = rmEntity.naturalidade;
    this.datachegada = rmEntity.datachegada;
    this.email = rmEntity.email;
    this.codprofissao = rmEntity.codprofissao;
    this.codocupacao = rmEntity.codocupacao;
    this.salario = rmEntity.pfunc ? rmEntity.pfunc.SALARIO : undefined;
    this.CODFUNCAO = rmEntity.pfunc ? rmEntity.pfunc.CODFUNCAO : undefined;
  }
}

export class FuncionarioDto {
  @ApiProperty()
  CHAPA: string;
  @ApiProperty()
  NOME: string;
  @ApiProperty()
  DESCFUNC: string;
  @ApiProperty()
  CPF: string;
  @ApiProperty()
  ORGAO: string;
  @ApiProperty()
  REG_ID_CODIGO: number;
  @ApiProperty()
  DTNASCIMENTO: Date;
  @ApiProperty()
  ENDERECO: string;
  @ApiProperty()
  EMAIL: string;
  @ApiProperty()
  TELEFONE: string;
  @ApiProperty()
  DIRETORIA: string;
  @ApiProperty()
  REG_DESCRICAO: string;
  @ApiProperty()
  NME_MUNIC: string;
  @ApiProperty()
  SUPERVISOR: string;
  @ApiProperty()
  CODSECAO: string;
  @ApiProperty()
  DIR_ID_CODIGO: number;
  @ApiProperty()
  GTC: string;

  constructor(item?: any) {
    this.NOME = item?.NOME;
    this.CPF = item?.CPF;
    this.DTNASCIMENTO = item?.DTNASCIMENTO;
    this.ENDERECO = item?.ENDERECO;
    this.EMAIL = item?.EMAIL;
    this.TELEFONE = item?.TELEFONE;
    this.DESCFUNC = item?.DESCFUNC;
    this.CHAPA = item?.CHAPA;
    this.DIRETORIA = item?.DIRETORIA;
    this.REG_DESCRICAO = item?.REG_DESCRICAO;

    this.REG_ID_CODIGO = item?.REG_ID_CODIGO;
    this.ORGAO = item?.ORGAO;
    this.NME_MUNIC = item?.NME_MUNIC;
    this.SUPERVISOR = item?.SUPERVISOR;
    this.CODSECAO = item?.CODSECAO;
    this.DIR_ID_CODIGO = item?.DIR_ID_CODIGO;
    this.GTC = item?.GTC;
  }
}

export class supervisorDto {
  CHAPA: string;
  NOME: string;
  CODBANCOPAGTO: string;
  CODAGENCIAPAGTO: string;
  CONTAPAGAMENTO: string;
  CODSECAO: string;
  CODIGO: string;
  constructor(partial: Partial<supervisorDto>) {
    Object.assign(this, partial);
  }
}
