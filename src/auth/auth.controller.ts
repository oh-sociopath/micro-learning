import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        console.log('controller: signupDto: ', signupDto);
        return this.authService.signup(signupDto);
    }
}
