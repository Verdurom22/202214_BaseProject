/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

@Module({
    imports: [TypeOrmModule.forFeature([AirportEntity])],
    providers: [AirportService]
})
export class AirportModule {}
