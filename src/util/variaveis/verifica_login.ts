import { AuthUserDto } from "src/auth/use.auth.Dto";
import { permissaoCargo } from "../enums/cargo";
import { HttpException, HttpStatus } from "@nestjs/common";

export function verificaAutorizacao(chapa:string, user:AuthUserDto) {
  if (chapa !== user.chapa) {
    console.log('chapa', chapa);
    if (
      user.permissao === permissaoCargo.USUARIO_NIVEL1 ||
      user.permissao === permissaoCargo.USUARIO_NIVEL2
    )
      throw new HttpException(
        'Usuário não tem autorização para cancelar saque de outro funcionário!!',
        HttpStatus.UNAUTHORIZED,
      );
  }
}
