import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import { Role } from 'src/Enum/general.enum'; 
import { ROLE_KEY } from '../decorators.ts/role.decorators'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
 
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(), 
      context.getClass(),  
    ]);

    // If no specific roles are required for the route, allow the request (return `true`)
    if (!requiredRoles) {
      return true;
    }

    // Get the current user object from the HTTP request (assuming user info is attached to the request)
    const user = context.switchToHttp().getRequest().user;

     
    return requiredRoles.some((role) => user.role === role);
  }
}
