import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../authentication/requestWithUser.interface';
import {ProfileEnum} from "./role.enum";

const ProfileRoleGuard = (profile: ProfileEnum): Type<CanActivate> => {
    class ProfileRoleMixin implements CanActivate {
        canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest<RequestWithUser>();
            const user = request.user;
            let userProfile = [];
            user?.profile.map(function (data) {
                userProfile.push((data.name).toLowerCase());
            })
            return userProfile.includes(profile.toLowerCase());
        }
    }

    return mixin(ProfileRoleMixin);
}

export default ProfileRoleGuard;
