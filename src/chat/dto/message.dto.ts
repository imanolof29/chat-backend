export class MessageDto {
    id: string
    senderId: string
    content: string

    constructor(properties: { id: string, senderId: string, content: string }) {
        this.id = properties.id
        this.senderId = properties.senderId
        this.content = properties.content
    }

}