import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('signin should return user', () => {
      expect(appController.signin({email: '', password: ''}).email).toBe('kakashka');
    });

    it('signup should return user', () => {
      expect(appController.signup({email: '', password: '', confirmPassword: ''}).email).toBe('kakashka');
    });

    it('verify should return user', () => {
      expect(appController.verify({userId: 1, token: ''}).email).toBe('kakashka');
    });
  });
});
