import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly chatService: ChatService) { }

    async handleConnection(client: Socket) {
        console.log(`Cliente conectado: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Cliente desconectado: ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    async handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
        try {
            if (!chatId) {
                client.emit('error', { message: 'chatId es obligatorio' });
                return;
            }

            client.join(chatId);
            console.log(`Cliente ${client.id} se unió al chat ${chatId}`);
            client.emit('joinedChat', { chatId });
        } catch (error) {
            console.error('Error en handleJoinChat:', error);
            client.emit('error', { message: 'No se pudo unir al chat' });
        }
    }

    @SubscribeMessage('leaveChat')
    async leaveChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
        try {
            if (!chatId) {
                client.emit('error', { message: 'chatId es obligatorio' });
                return;
            }

            client.leave(chatId);
            console.log(`Cliente ${client.id} salió del chat ${chatId}`);
            client.emit('leftChat', { chatId });
        } catch (error) {
            console.error('Error en leaveChat:', error);
            client.emit('error', { message: 'No se pudo salir del chat' });
        }
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() data: { chatId: string; userId: string; content: string },
        @ConnectedSocket() client: Socket,
    ) {
        console.log(data)
        try {
            const { chatId, userId, content } = data;

            if (!chatId || !userId || !content) {
                client.emit('error', { message: 'Datos incompletos' });
                return;
            }

            await this.chatService.createChatMessage({
                dto: { chatId, content },
                userId,
            });

            console.log(`Nuevo mensaje en chat ${chatId}: ${content} (por usuario ${userId})`);

            this.server.to(chatId).emit('newMessage', {
                chatId,
                userId,
                content,
            });
        } catch (error) {
            console.error('Error en handleSendMessage:', error);
            client.emit('error', { message: 'No se pudo enviar el mensaje' });
        }
    }

    @SubscribeMessage('getMessages')
    async handleGetMessages(@MessageBody() chatId: { chatId: string }, @ConnectedSocket() client: Socket) {
        const messages = await this.chatService.getChatMessages(chatId.chatId);
        client.emit('messages', messages);
    }

}
