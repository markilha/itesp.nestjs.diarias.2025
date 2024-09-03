import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requisicao } from './entities/requisicao.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'connection1', // Nome da conexão 1
      useFactory: async (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.get<string>('DB1_HOST'),
        port: +configService.get<string>('DB1_PORT'),
        username: configService.get<string>('DB1_USER'),
        password: configService.get<string>('DB1_PASS'),
        database: configService.get<string>('DB1_NAME'),
        entities: [Requisicao],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'connection2', // Nome da conexão 2
      useFactory: async (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.get<string>('DB2_HOST'),
        port: +configService.get<string>('DB2_PORT'),
        username: configService.get<string>('DB2_USER'),
        password: configService.get<string>('DB2_PASS'),
        database: configService.get<string>('DB2_NAME'),
        entities: [Requisicao],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}

