import {PassportSerializer} from "@nestjs/passport";
import {UsersService} from "../users/users.service";
import {UserEntity} from "../users/entities/user.entity";

export class LocalSerializer extends PassportSerializer{
    constructor(private readonly userService: UsersService) {
        super();
    }

    serializeUser(user: UserEntity, done: Function): any {
        done(null, user.id);
    }

    async deserializeUser(userId: string, done: CallableFunction){
        const user = await this.userService.findOne(Number(userId));
        done(null, user);
    }
}
