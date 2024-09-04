import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({  
      name: 'db_requisicao',
      useFactory: async (configService: ConfigService) => ({        
        type: 'oracle',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        serviceName: configService.get<string>('DB_NAME'), 
        entities: [__dirname + '/entities/**'],      
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbReqModule {}
