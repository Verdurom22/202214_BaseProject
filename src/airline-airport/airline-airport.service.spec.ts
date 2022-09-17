/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];
  let airline: AirlineEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airlineRepository.clear();
    airportRepository.clear();
    airportsList = [];
    for(let i = 0; i < 5; i++) {
      const airport = await airportRepository.save({
        name: faker.company.name(),
        code: faker.random.alphaNumeric(),
        country: faker.address.country(),
        city: faker.address.city(),
        airlines: []
      });
      airportsList.push(airport);
    }
    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundeddate: faker.date.birthdate(),
      webpage: faker.internet.domainName(),
      airports: airportsList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to an airline', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundeddate: faker.date.birthdate(),
      webpage: faker.internet.domainName(),
      airports: []
    });

    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });

    const result: AirlineEntity = await service.addAirportToAirline(newAirport.id, newAirline.id);

    expect(result).not.toBeNull();
    expect(result.airports).not.toBeNull();
    expect(result.airports).toHaveLength(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toEqual(newAirport.name);
    expect(result.airports[0].code).toEqual(newAirport.code);
    expect(result.airports[0].country).toEqual(newAirport.country);
    expect(result.airports[0].city).toEqual(newAirport.city);
  });

  it('addAirportToAirline should throw exception for an invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundeddate: faker.date.birthdate(),
      webpage: faker.internet.domainName(),
      airports: []
    });
    await expect(() =>
      service.addAirportToAirline('0', newAirline.id),
    ).rejects.toHaveProperty('message',
      'The airport with the given id was not found')
  });

  it('addAirportToAirline should throw exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });
    await expect(() =>
      service.addAirportToAirline(newAirport.id, '0'),
    ).rejects.toHaveProperty('message',
      'The airline with the given id was not found')
  });

  it('findAirportFromAirline should return an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAiport: AirportEntity = await service.
      findAirportFromAirline(airline.id, airport.id);
    expect(storedAiport).not.toBeNull();
    expect(storedAiport.name).toEqual(airport.name);
  });

  it('findAirportFromAirline should throw exception for invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.findAirportFromAirline('0', airport.id)
    ).rejects.toHaveProperty('message',
      'The airline with the given id was not found')
  });

  it('findAirportFromAirline should throw exception for invalid airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, '0')
    ).rejects.toHaveProperty('message',
      'The airport with the given id was not found')
  });

  it('findAirportFromAirline should throw exception for a non associated airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });
    await expect(() =>
      service.findAirportFromAirline(airline.id, newAirport.id)
      ).rejects.toHaveProperty('message',
        'The airport with the given id is not associated with the airline')
    });

  it('findAirportsFromAirline should return list of airports', async () => {
    const result: AirportEntity[] = await service.findAirportsFromAirline(airline.id);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(airportsList.length);
  });

  it('findAirportsFromAirline should throw exception for invalid airline', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0')
    ).rejects.toHaveProperty('message',
      'The airline with the given id was not found')
  });

  it('updateAirportsFromAirline should update airports from airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });
    const updatedAirline: AirlineEntity = 
      await service.updateAirportsFromAirline(airline.id, [newAirport]);
    expect(updatedAirline).not.toBeNull();
    expect(updatedAirline.airports).toHaveLength(1);
  });

  it('updateAirportsFromAirline should throw exception for invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });
    await expect(() =>
      service.updateAirportsFromAirline('0', [newAirport])
    ).rejects.toHaveProperty('message',
      'The airline with the given id was not found')
  });

  it('updateAirportsFromAirline should throw exception for invalid airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });
    newAirport.id = '0';
    await expect(() =>
      service.updateAirportsFromAirline(airline.id, [newAirport])
    ).rejects.toHaveProperty('message',
      'The airport with the given id was not found')
  });

  it('deleteAirportFromAirline should delete airport from airline', async() => {
    const airport = airportsList[0];
    await service.deleteAirportFromAirline(airport.id, airline.id);
    const storedAirline: AirlineEntity = await airlineRepository.findOne({
      where: {id: airline.id},
      relations: ['airports'],
    });
    const deletedAirport: AirportEntity = storedAirline.airports.find(
      a => a.id === airport.id,
    );
    expect(deletedAirport).toBeUndefined();
  });

  it('deleteAirportFromAirline should throw exception for invalid airline', async() => {
    const airport = airportsList[0];
    await expect(() =>
      service.deleteAirportFromAirline(airport.id, '0')
    ).rejects.toHaveProperty('message',
      'The airline with the given id was not found')
  });

  it('deleteAirportFromAirline should throw exception for invalid airport', async() => {
    const airport = airportsList[0];
    airport.id = '0';
    await expect(() =>
      service.deleteAirportFromAirline(airport.id, airline.id)
    ).rejects.toHaveProperty('message',
      'The airport with the given id was not found')
  });

  it('deleteAirportFromAirline should throw exception for a non associated airport', async() => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    });
  await expect(() =>
    service.deleteAirportFromAirline(newAirport.id, airline.id)
    ).rejects.toHaveProperty('message',
      'The airport with the given id is not associated with the airline')
  });

});
