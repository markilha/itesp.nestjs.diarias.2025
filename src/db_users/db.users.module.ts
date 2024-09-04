import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({   
      name: 'db_users',    
      useFactory: async (configService: ConfigService) => ({        
        type: 'oracle',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USER_USERCS'),
        password: configService.get<string>('DB_PASS_USERCS'),
        serviceName: configService.get<string>('DB_NAME_USERCS'), // Usando serviceName para o nome do serviço
        entities: [__dirname + '/entities/**'],
        migrations: [__dirname + '/migrations/*.ts'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbUsersModule {}
