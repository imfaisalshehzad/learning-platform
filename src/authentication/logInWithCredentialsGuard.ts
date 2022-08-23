import {AuthGuard} from "@nestjs/passport";
import {ExecutionContext} from "@nestjs/common";


export class LogInWithCredentialsGuard extends AuthGuard('local'){
    async canActivate(ctx: ExecutionContext): Promise<boolean>{
        await super.canActivate(ctx);
        const request = ctx.switchToHttp().getRequest();
        await super.logIn(request);
        return true;
    }
}
