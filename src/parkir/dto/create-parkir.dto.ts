import { jenisKendaraan } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateParkirDto {
    @IsNotEmpty()
    @IsString()
    platNomor: string

    @IsNotEmpty()
    @IsEnum(jenisKendaraan)
    jenisKendaraan: jenisKendaraan

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    durasi: number
}
