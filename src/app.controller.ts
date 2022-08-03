import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthUser } from './model/auth-user';
import { SignInBody } from './model/signin-body';
import { SignUpBody } from './model/signup-body';
import { VerifyBody } from './model/verify-body';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signin')
  signin(@Body() body: SignInBody): AuthUser | {error: string} {
    try {
      return this.appService.signin(body);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  
  @Post('signup')
  signup(@Body() body: SignUpBody): AuthUser | {error: string} {
    try {
      return this.appService.signup(body);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  @Post('verify')
  verify(@Body() body: VerifyBody): AuthUser | {error: string} {
    try {
      return this.appService.verify(body);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
