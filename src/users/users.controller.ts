import { Controller, Get, UseGuards, Param, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindAllParamsDto,  returnTotal,  userInfo, userNivelDto, UsersDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/interceptors/http-logging.interceptor';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

@UseGuards(AuthGuard)
@ApiTags('users')
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listagem todo os usuários' })
  @ApiResponse({ status: 200, description: 'Usuários encontrados' })
  async findAll(@Query() params: FindAllParams): Promise<returnTotal> {
    return await this.usersService.findAll(params);
  }

  @Get('findone')
  @ApiOperation({ summary: 'Retorna o usuário pelo id' })
  findOne(@Query() params: FindAllParamsDto) {
    return this.usersService.findOne(params);
  }

  @Get('nivel')
  @ApiOperation({ summary: 'Lista os acessos do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista os acessos do usuáiro',
    type: userNivelDto,
    isArray: true,
  })
  findNivel(@Query('id') id: number): Promise<userNivelDto[]> {
    return this.usersService.findNivel(id);
  }

  @Get('user-info')
   @ApiOperation({ summary: 'Retonar o usuário logado' })
   @ApiResponse({
    status: 200,
    description: 'Lista o usuário logado!',
    type: userInfo,
   
  
  })
  getInfo(@CurrentUser() user: AuthUserDto): userInfo {
    return {
      id_usuario: user.sub,
      login: user.login,
      chapa: user.chapa,
      roles: user.roles,
    };
  }
}
