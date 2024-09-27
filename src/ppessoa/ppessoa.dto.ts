export class RMPessoaDto {
    codigo: number;
    nome?: string;
    // apelido?: string;
    // dtnascimento?: Date;
    // estadocivil?: string;
    // sexo?: string;
    // nacionalidade?: string;
    // grauinstrucao?: string;
    // rua?: string;
    // numero?: string;
    // complemento?: string;
    // bairro?: string;
    // estado?: string;
    // cidade?: string;
    // cep?: string;
    // pais?: string;
    // regprofissional?: string;
    // cpf?: string;
    // idimagem?: number;
    // telefone1?: string;
    // telefone2?: string;
    // cartidentidade?: string;
    // ufcartident?: string;
    // orgemissorident?: string;
    // dtemissaoident?: Date;
    // tituloeleitor?: string;
    // zonatiteleitor?: string;
    // secaotiteleitor?: string;
    // carteiratrab?: string;
    // seriecarttrab?: string;
    // ufcarttrab?: string;
    // dtcarttrab?: Date;
    // nit?: number;
    // cartmotorista?: string;
    // tipocarthabilit?: string;
    // dtvenchabilit?: Date;
    // certifreserv?: string;
    // categmilitar?: string;
    // naturalidade?: string;
    // estadonatal?: string;
    // datachegada?: Date;
    // cartmodelo19?: string;
    // conjuguebrasil?: number;
    // naturalizado?: number;
    // filhosbrasil?: number;
    // nrofilhosbrasil?: number;
    // nroreggeral?: string;
    // nrodecreto?: string;
    // dtvencident?: Date;
    // dtvenccarttrab?: Date;
    // tipovisto?: string;
    // email?: string;
    // investtreinant?: number;
    // corraca?: number;
    // deficientefisico?: number;
    // codusuario?: string;
    // telefone3?: string;
    // fax?: string;
    // empresa?: string;
    // codprofissao?: number;
    // codocupacao?: string;
    // email2?: string;
    // defvisual?: number;
    // defauditivo?: number;
    // defmental?: number;
    // defreabilitado?: number;
    // funcionariopr?: number;
    // funcionariopub?: number;
  
  }

  export interface FindAllParams {
    nome: string; 
    page?: number;
    limit?: number;
  }
  
  