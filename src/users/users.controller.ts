import { Controller, Get, Post, Body, UseGuards, Delete, Param, Query, Put, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto, UserUpdateDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/interceptors/http-logging.interceptor';

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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
