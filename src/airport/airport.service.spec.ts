/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>> (
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airpot: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.random.alphaNumeric(),
        country: faker.address.country(),
        city: faker.address.city(),
        airlines: [],
      });
      airportsList.push(airpot);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return an airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name);
    expect(airport.code).toEqual(storedAirport.code);
    expect(airport.country).toEqual(storedAirport.country);
    expect(airport.city).toEqual(storedAirport.city);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });  

  it('create should return a new airport', async () => {
    const nAirport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: [],
    };

    const createdAirport: AirportEntity = await service.create(nAirport);
    expect(createdAirport).not.toBeNull();
    const storedAirport: AirportEntity = await repository.findOne({
      where: {id: createdAirport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(createdAirport.name);
    expect(storedAirport.code).toEqual(createdAirport.code);
    expect(storedAirport.country).toEqual(createdAirport.country);
    expect(storedAirport.city).toEqual(createdAirport.city);
  });

  it('update should modify an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = 'New airport name';
    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
    const storedAirport: AirportEntity = await repository.findOne({
      where: {id: updatedAirport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name);
  });

  it('update should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = 'New name';
    await expect(() => service.update('0', airport)).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('delete should remove an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
    const deletedAirport: AirportEntity = await repository.findOne({
      where: {id: airport.id },
    });
    expect(deletedAirport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

});
