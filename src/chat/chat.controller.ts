import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Auth } from "src/auth/decorator/auth.decorator";
import { RequestUser } from "src/auth/decorator/user.decorator";
import { UserDto } from "src/auth/dto/user.dto";

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

}