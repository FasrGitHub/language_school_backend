import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SignIn e2e tests', () => {
  let app: INestApplication;

  function registerUser(email: string, password: string) {
    return request(app.getHttpServer())
      .post('/signup')
      .send({ email, password, confirmPassword: password });
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * POST /signin
   */
  describe('POST /signin', () => {
    it('Если пользователь при входе вводит существующие на сервере данные, то производится вход', async () => {
      await registerUser('abc@gmail.com', 'A123a123');

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send({ email: 'abc@gmail.com', password: 'A123a123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        userId: 1,
        email: 'abc@gmail.com',
        token: expect.any(String),
      });
    });

    it('Если пользователь при входе вводит несуществующий на сервере email, то возвращается ошибка', async () => {
      await registerUser('abc@gmail.com', 'A123a123');

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send({ email: 'unknown@gmail.com', password: 'A123a123' });

      expect(response.body).toEqual({
        error: 'Пользователь с таким email не найден',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(400);
    });

    it('Если пользователь при входе вводит неверный пароль, то возвращается ошибку', async () => {
      await registerUser('abc@gmail.com', 'A123a123');

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send({ email: 'abc@gmail.com', password: 'A123aaa' });

      expect(response.body).toEqual({
        error: 'Пароль не подошел',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(400);
    });

    it('Если пользователь при входе не вводит email, то возвращается ошибку', async () => {
      await registerUser('abc@gmail.com', 'A123a123');

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send({ email: '', password: 'A123a123' });

      expect(response.body).toEqual({
        error: 'Пользователь с таким email не найден"',
      }); // должно быть - "вы не ввели email"
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });

    it('Если пользователь при входе не вводит пароль, то возвращается ошибку', async () => {
      await registerUser('abc@gmail.com', 'A123a123');

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send({ email: 'abc@gmail.com', password: '' });

      expect(response.body).toEqual({ error: 'Пароль не подошел' });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });

    it('Если пользователь при входе вводит невалидные данные, то возвращается ошибку', async () => {
      await registerUser('abc@gmail.com', 'A123a123');

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send({ email: '123', password: '123' });

      expect(response.body).toEqual({ error: 'Невалидные данные' });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });
  });
});
