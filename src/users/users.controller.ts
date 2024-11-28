import { Controller, Get, UseGuards, Param, Query,  UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindAllParamsDto, userNivelDto, UsersDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/interceptors/http-logging.interceptor';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
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
  async findAll(@Query() params: FindAllParams): Promise<UsersDto[]> {
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
  @Roles(Role.SUPERVISOR)
  @Get('me')
  getMe(@CurrentUser() user: AuthUserDto) {
    return {
      id: user.sub,
      login: user.login,
      chapa: user.chapa,
      roles: user.roles,
    };
  }
}
