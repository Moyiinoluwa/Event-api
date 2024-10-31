import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import { Observable } from 'rxjs';
import { Role } from 'src/Enum/general.enum'; 
import { ROLE_KEY } from '../decorators.ts/role.decorators'; 

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
 
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(), 
      context.getClass(),  
    ]);

    // If no specific roles are required for the route, allow the request
    if (!requiredRoles) {
      return true;
    }

    // Get the current user object from the HTTP request (assuming user info is attached to the request)
    const{user} = context.switchToHttp().getRequest();
     
    if(user.role == 'admin'){
      return true;
    }else{
      return false;
    }
     
   // return requiredRoles.some(role => user.role === role);
     
  }
}
