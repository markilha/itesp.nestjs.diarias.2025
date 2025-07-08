import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'oracleConnection',
      useFactory: async (configService: ConfigService) => {
        // Configuração para usar o Thick Mode
        oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_8' });

        return {
          type: 'oracle',
          host: configService.get<string>('DB_HOST_ORA'),
          port: +configService.get<string>('DB_PORT_ORA'),
          username: configService.get<string>('DB_USER_ORA'),
          password: configService.get<string>('DB_PASS_ORA'),
          serviceName: configService.get<string>('DB_NAME_ORA'),
          entities: [__dirname + '/entities/**'],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DbOraModule {}
