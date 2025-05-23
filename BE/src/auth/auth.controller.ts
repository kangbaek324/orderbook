import { Body, Controller, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorator/get-user.decorator';
import { Payload } from './interfaces/payload.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @ApiOperation({ summary: "회원가입" })
    @ApiResponse({ status: "2XX", description: ""})
    @Post("/sign-up")
    async signup(@Body() data: SignupDto): Promise<void> {
        return this.authService.signup(data);
    }

    @ApiOperation({ summary: "로그인" })
    @ApiResponse({ status: "2XX", description: `
        {
            "accessToken": "jwt token.."
        }    
    `})
    @Post("/sign-in")
    @UseInterceptors(jwtInterceptor)
    async signin(@Body() data: SigninDto): Promise<unknown> {
        return this.authService.signin(data)
    }

    @ApiOperation({ summary: "계좌개설" })
    @ApiBearerAuth("access-token")
    @ApiResponse({ status: "2XX", description: `
        {
            "account_number": 1010,
            "money": "100000000"
        }
    `})
    @Post("/account")
    @UseGuards(AuthGuard("jwt"))
    async accountCreate(@GetUser() user: Payload): Promise<unknown> {
        return this.authService.createAccount(user);
    }
}
