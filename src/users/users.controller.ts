import { Controller, Get, UseGuards, Param, Query,  UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { userNivelDto, UsersDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/interceptors/http-logging.interceptor';
import { CurrentUser } from 'src/auth/current-user.decorator';

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

  @Get('/:id')
  @ApiOperation({ summary: 'Retorna o usuário pelo id' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('nivel/:id')
  @ApiOperation({ summary: 'Lista os acessos do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista os acessos do usuáiro',
    type: userNivelDto,
    isArray: true,
  })  
  findNivel(@Param('id') id: number): Promise<userNivelDto[]> {
    return this.usersService.findNivel(id);
  }
  @Get('me/me')
  getMe(@CurrentUser() user) {
    return {
      id: user.sub,
      login: user.login,
      chapa: user.chapa,
      roles: user.roles,
    };
  }
}
