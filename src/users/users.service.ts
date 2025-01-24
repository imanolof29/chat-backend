import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getUsers() {
        return this.prisma.user.findMany()
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        })
    }

}
