import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class  JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super()
    }
}


//AuthGuard tells guard to use the JWT strategy was implemented in the JwtStrategy class