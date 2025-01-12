import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server

    handleConnection(client: Socket) {
        this.server.emit('user-joined', {
            message: "User joined chat"
        })
    }

    handleDisconnect(client: Socket) {
        this.server.emit('user-left', {
            message: "User left chat"
        })
    }

    @SubscribeMessage('chat')
    handleMessage(@MessageBody() message: string) {
        this.server.emit('message', message)
        return message
    }

}