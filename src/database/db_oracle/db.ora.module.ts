import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({       
      name: 'oracleConnection',   
      useFactory: async (configService: ConfigService) => ({        
        type: 'oracle',
        host: configService.get<string>('DB_HOST_ORA'),
        port: +configService.get<string>('DB_PORT_ORA'),
        username: configService.get<string>('DB_USER_ORA'),
        password: configService.get<string>('DB_PASS_ORA'),
        serviceName: configService.get<string>('DB_NAME_ORA'), 
        entities: [__dirname + '/entities/**'],      
        synchronize: false,
      }),
      inject: [ConfigService],
      
    }),
  ],
})

export class DbOraModule {}
