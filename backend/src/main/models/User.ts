import { User } from "@prisma/client";
import { DisplayUserDtoType } from "@dtos/users/DisplayUserDto";

export class ModelUser {
    id: string;
    username: string | null;
    email: string | null;
    passwordHash: string | null;

    constructor(data: User) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.passwordHash = data.passwordHash;
    }

    display(): DisplayUserDtoType {
        return {
            id: this.id,
            username: this.username ?? "",
            email: this.email ?? "",
        };
    }
}
