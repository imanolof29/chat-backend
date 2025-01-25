export class ChatDto {
    id: string
    users: string[]
    lastMessage?: string

    constructor(properties: {
        id: string,
        users: string[],
        lastMessage?: string
    }) {
        this.id = properties.id
        this.users = properties.users
        this.lastMessage = properties.lastMessage
    }

}