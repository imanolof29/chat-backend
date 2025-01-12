import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway()
export class ChatGateway {

    @WebSocketServer() server: Server

    constructor(private readonly chatService: ChatService) { }

    @SubscribeMessage('joinChat')
    async handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
        client.join(chatId)
        client.emit('joinedChat', { chatId })
    }

    @SubscribeMessage('leaveChat')
    async leaveChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
        client.leave(chatId)
        client.emit('leftChat', { chatId })
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() data: { chatId: string, userId: string, content: string },
        @ConnectedSocket() client: Socket
    ) {
        const { chatId, userId, content } = data

        await this.chatService.createChatMessage({
            dto: { chatId, content },
            userId
        })

        this.server.to(chatId).emit('newMessage', {
            chatId,
            userId,
            content
        })

    }

}