import { PPessoaEntity } from 'src/database/db_oracle/entities/ppessoa.entity';
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
  pfunc?: any;
  
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
    this.pfunc = rmEntity.pfunc;
  }
}
