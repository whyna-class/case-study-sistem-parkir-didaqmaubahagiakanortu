import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parkir.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { jenisKendaraan } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateParkirDto extends PartialType(CreateParkirDto) {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    durasi: number
}
