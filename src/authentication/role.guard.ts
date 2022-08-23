import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../authentication/requestWithUser.interface';
import {RoleEnum} from "./role.enum";

const RoleGuard = (role: RoleEnum): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest<RequestWithUser>();
            const user = request.user;
            return user?.role.includes(role);
        }
    }

    return mixin(RoleGuardMixin);
}

export default RoleGuard;
