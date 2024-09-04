import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({   
      name: 'db_rm',    
      useFactory: async (configService: ConfigService) => ({        
        type: 'oracle',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USER_RM'),
        password: configService.get<string>('DB_PASS_RM'),
        serviceName: configService.get<string>('DB_NAME_RM'),
        entities: [__dirname + '/entities/**'],      
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbRmModule {}
