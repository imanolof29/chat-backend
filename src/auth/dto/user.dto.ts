export class UserDto {
    id: string
    username: string
    email: string
    created: Date

    constructor(properties: {
        id: string
        username: string
        email: string
        created: Date
    }) {
        this.id = properties.id
        this.username = properties.username
        this.email = properties.email
        this.created = properties.created
    }

}