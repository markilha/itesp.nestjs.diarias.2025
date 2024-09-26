import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Query,
  Put,

} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto, UserUpdateDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './users.dto';

@UseGuards(AuthGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: UsersDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<UsersDto[]> {
    return await this.usersService.findAll(params);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
