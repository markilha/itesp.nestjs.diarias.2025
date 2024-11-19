import {
  Controller, 
  Get, 
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { itensreqrecService } from './itensreqrec.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {  ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { itensreqrecEntity } from 'src/database/db_oracle/entities/itensreqrec.entity';

@ApiTags('itensreqrec')
@UseGuards(AuthGuard)
@Controller('itensreqrec')
@UseInterceptors(AllExceptionsFilter)
export class itensreqrecController {
  constructor(private readonly itensreqrecService: itensreqrecService) {}

  @Get('findone')
  async findOne(@Query('ITE_ID_CODIGO') ITE_ID_CODIGO: number): Promise<itensreqrecEntity> {
    const itensreqrec = await this.itensreqrecService.findOne(ITE_ID_CODIGO);  
    return itensreqrec;
  }
 

}
