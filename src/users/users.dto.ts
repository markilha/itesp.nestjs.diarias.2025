export class UsersDto {
  readonly id?: number;
  readonly nome: string;
  readonly login: string;
  readonly senha: string;
}
export class UserUpdateDto {
    readonly nome?: string;
    readonly login?: string; 
  }

export interface FindAllParams {
  nome: string;
  login: string;
}

