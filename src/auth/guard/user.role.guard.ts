import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "src/Enum/general.enum";
import { ROLE_KEY } from "../decorators.ts/role.decorators";
import { Reflector } from "@nestjs/core";

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest()
       // return requiredRoles.includes(user.role)
        if(user.role == 'user') {
            return true
        } else {
            return false
        }
    }
}