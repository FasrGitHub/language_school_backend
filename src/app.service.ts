import { Injectable } from '@nestjs/common';
import { AuthUser } from './model/auth-user';
import { SignInBody } from './model/signin-body';
import { SignUpBody } from './model/signup-body';
import { User } from './model/user';
import { VerifyBody } from './model/verify-body';

@Injectable()
export class AppService {
  private users: User[] = [];
  private authorizedUsers: AuthUser[] = [];
  
  signup(signUpBody: SignUpBody): AuthUser {
    const user = this.users.find(user => user.email === signUpBody.email);

    if (!user) {
      if (signUpBody.password === signUpBody.confirmPassword) {
        const user = {
          email: signUpBody.email,
          password: signUpBody.password,
          userId: this.users.length + 1
        };
  
        this.users.push(user);
  
        return this.signin({ email: signUpBody.email, password: signUpBody.password});
      } else {
        throw new Error('Пароли не совпадают');
      }
    } else {
      throw new Error('Пользователь с этим email уже существует');
    }
  }

  signin(signInBody: SignInBody): AuthUser {
    const user = this.users.find(user => user.email === signInBody.email);

    if (user) {
      if (user.password === signInBody.password) {
        const authUser: AuthUser = {
          userId: user.userId,
          email: user.email,
          token: Math.random().toString(),
        };
    
        this.authorizedUsers = this.authorizedUsers.filter(user => user.email !== signInBody.email);
        this.authorizedUsers.push(authUser);
    
        return authUser;
      } else {
        throw new Error('Пароль не подошел');
      }
    } else {
      throw new Error('Пользователь с таким email не найден');
    }
  }

  verify(verifyBody: VerifyBody): AuthUser {
    const authUser = this.authorizedUsers.find(authUser => authUser.userId === verifyBody.userId);

    if (authUser && authUser.token === verifyBody.token) {
      return authUser;
    } else {
      throw new Error('Что-то пошло не так');
    }
  }
}
