import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { docsService } from './docs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileDto, FindAllParams } from './docs.Dto';

@UseGuards(AuthGuard)
@ApiTags('docs')
@Controller('docs')
export class docsController {
  constructor(private readonly docsService: docsService) {}

  @Get('link')
  @ApiOperation({ summary: 'Obtém link para download de um documento' })
  @ApiResponse({
    status: 200,
    description: 'link para download de um documento',
    schema: {
      example: { url: 'https://exemplo.com/documento.pdf' },
    },
  })
  async getDocumentLink(@Query() params: FindAllParams) {
    return await this.docsService.getDocumentLink(params.ID_DOC);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Faz docs de um arquivo para o OBS e salva no banco de dados' })
  @ApiParam({
    name: 'multipart/form-data',
    description: 'formato de envio de arquivo',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo enviado com sucesso',
  })
  async docsFile(@UploadedFile() file: FileDto, @Body() body: { SQE_ID_CODIGO: number }) {
    if (!file) {
      throw new HttpException({ message: 'Nenhum arquivo foi enviado' }, HttpStatus.BAD_REQUEST);
    }

    try {
      await this.docsService.docsToOBS(file, body.SQE_ID_CODIGO);
      return { message: 'Arquivo enviado com sucesso' };
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Erro ao fazer docs' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
