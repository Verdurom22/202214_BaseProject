/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  providers: [AirlineAirportService]
})
export class AirlineAirportModule {}
