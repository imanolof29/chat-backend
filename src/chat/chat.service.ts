import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { MessageDto } from "./dto/message.dto";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getChatMessages(chatId: string): Promise<MessageDto[]> {
        const messages = await this.prisma.message.findMany({
            where: {
                chatId
            }
        })
        return messages.map((message) => new MessageDto({
            id: message.id,
            senderId: message.senderId,
            content: message.content
        }))
    }

    async createChatMessage(properties: { dto: CreateMessageDto, userId: string }) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: properties.dto.chatId }
        });

        if (!chat) {
            throw new BadRequestException("Chat not found");
        }

        await this.prisma.message.create({
            data: {
                content: properties.dto.content,
                senderId: properties.userId,
                chatId: properties.dto.chatId,
            },
        });
    }

    async createChat(properties: { userId: string, userId2: string }) {
        const { userId, userId2 } = properties;

        const existingChat = await this.prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        userId: { in: [userId, userId2] },
                    },
                },
            },
        });

        if (existingChat) {
            return existingChat;
        }
        const newChat = await this.prisma.chat.create({
            data: {
                users: {
                    create: [
                        { userId: userId },
                        { userId: userId2 },
                    ],
                },
            },
            include: { users: true },
        });

        return newChat;
    }

}