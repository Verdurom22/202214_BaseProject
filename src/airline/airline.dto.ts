/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {IsDate, IsNotEmpty, IsString} from 'class-validator';
export class AirlineDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    readonly foundeddate: Date;

    @IsString()
    @IsNotEmpty()
    readonly webpage: string;

}
