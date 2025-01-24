import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [ChatService, ChatGateway, PrismaService],
    controllers: [ChatController],
    imports: [AuthModule]
})
export class ChatModule { }
