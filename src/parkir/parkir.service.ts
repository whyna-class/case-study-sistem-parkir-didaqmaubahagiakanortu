import { Injectable } from '@nestjs/common';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindParkirDto } from './dto/find-parkir-dto';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}

  async create(createParkirDto: CreateParkirDto) {
    try {
      const {platNomor, jenisKendaraan, durasi} = createParkirDto
      let total = 0
      let bedaTarif = 0

      if (jenisKendaraan === 'RODA2') {
        total = 3000
        bedaTarif = 2000
      } else if (jenisKendaraan === 'RODA4') {
        total = 6000
        bedaTarif = 4000
      } else {
        return {
          success: false,
          message: 'Jenis kendaraan tidak dikenal',
          data: null
        }
      }

      if (durasi === 1) {
        total
      } else if (durasi > 1) {
        total+= (durasi - 1) * bedaTarif
      } else {
        return {
          success: false,
          message: 'Durasi harus lebih dari atau sama dengan 1',
          data: null
        }
      } 

      const create = await this.prisma.parkir.create({
        data: {
          platNomor,
          jenisKendaraan,
          durasi,
          total
        }
      })

      return {
        success: true,
        message: 'Parkir dibuat secara sukses',
        data: create
      }
    } catch (error) {
      return {
        success: false,
        message: `Error saat membuat parkir: ${error}`,
        data: null
      }
    }
  }

  async findAll(findParkirDto: FindParkirDto) {
    try {
      const {search = '', page = 1, limit = 10, jenisKendaraan} = findParkirDto
      const skip = (page - 1) * limit

      const where: any = {}

      if (search) {
        where.platNomor = {
          contains: search
        }
      }

      if (jenisKendaraan) {
        where.jenisKendaraan = jenisKendaraan
      }

      const parking = await this.prisma.parkir.findMany({
        where,
        skip: skip,
        take: Number(limit)
      })
      const total = await this.prisma.parkir.count({where})

      return {
        success: true,
        message: 'Parkir ditemukan secara sukses',
        data: parking,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total/limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Error saat mencari parkir: ${error}`,
        data: null,
        meta: null
      }
    }
  }

  async findOne(id: number) {
    try {
      const findOne = await this.prisma.parkir.findFirst({where: {id: id}})

      if (!findOne) {
        return {
          success: false,
          message: 'Parkir tidak ditemukan',
          data: null
        }
      }

      return {
        success: true,
        message: 'Parkir ditemukan secara sukses',
        data: findOne
      }
    } catch (error) {
      return {
        success: false,
        message: `Error saat mencari parkir: ${error}`,
        data: null
      }
    }
  }

  async update(id: number, updateParkirDto: UpdateParkirDto) {
    try {
      const {durasi} = updateParkirDto
      const findOne = await this.prisma.parkir.findFirst({where: {id: id}})
      let jenisKendaraan = findOne?.jenisKendaraan
      let total = 0 
      let bedaTarif = 0

      if (!findOne) {
        return {
          success: false,
          message: 'Parkir tidak ditemukan',
          data: null
        }
      }

      if (jenisKendaraan === 'RODA2') {
        total = 3000
        bedaTarif = 2000
      } else if (jenisKendaraan === 'RODA4') {
        total = 6000
        bedaTarif = 4000
      } else {
        return {
          success: false,
          message: 'Jenis kendaraan tidak dikenal',
          data: null
        }
      }

      if (durasi === 1) {
        total
      } else if (durasi > 1) {
        total+= (durasi - 1) * bedaTarif
      } else {
        return {
          success: false,
          message: 'Durasi harus lebih dari atau sama dengan 1',
          data: null
        }
      } 

      const update = await this.prisma.parkir.update({where: {id: id},
        data: {
          platNomor: findOne.platNomor,
          jenisKendaraan: findOne.jenisKendaraan,
          durasi: durasi ?? findOne.durasi,
          total
        }
      })

      return {
        success: true,
        message: 'Parkir diubah dengan sukses',
        data: update
      }
    } catch (error) {
      return {
        success: false,
        message: `Error saat mengubah parkir: ${error}`,
        data: null
      }
    }
  }

  async remove(id: number) {
    try {
      const remove = await this.prisma.parkir.delete({where: {id: id}})
      return {
        success: true,
        message: 'Parkir dihapus secara sukses',
        data: remove
      }
    } catch (error) {
      return {
        success: false,
        message: `Error saat menghapus parkir: ${error}`,
        data: null
      }
    }
  }

  async total() {
    try {
      const total = await this.prisma.parkir.aggregate({_sum: {total: true}})
      
      return {
        success: true,
        message: 'Total dihitung secara sukses',
        data: total
      }
    } catch (error) {
      return {
        success: false,
        message: `Error saat menghitung total: ${error}`,
        data: null
      }
    }
  }
}
