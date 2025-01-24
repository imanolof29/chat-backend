import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Auth } from "src/auth/decorator/auth.decorator";
import { RequestUser } from "src/auth/decorator/user.decorator";
import { UserDto } from "src/auth/dto/user.dto";
import { error } from "console";

@Controller('chats')
export class ChatController {

    constructor(private readonly chatService: ChatService) { }

    @Get('find')
    @Auth()
    async getUserChats(
        @RequestUser() user: UserDto
    ) {
        return this.chatService.getUserChats(user.id)
    }

    @Post('create')
    @Auth()
    async createChat(
        @RequestUser() user: UserDto,
        @Body() data: { userId: string }
    ) {
        try {
            return this.chatService.createChat({
                userId: user.id,
                userId2: data.userId
            })
        } catch (error) {
            console.log(error)
        }
    }

}