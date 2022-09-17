/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirportModule } from './airport/airport.module';
import { AirlineModule } from './airline/airline.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport/airport.entity';
import { AirlineEntity } from './airline/airline.entity';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';

@Module({
  imports: [AirportModule, AirlineModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'airlines',
    entities: [AirportEntity, AirlineEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }), AirlineAirportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
