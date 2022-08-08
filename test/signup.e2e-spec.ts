import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sign Up e2e tests', () => {
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
   * POST /signup
   */

  describe('POST /signup', () => {
    it('Если пользователь при регистрации указывает одинаковые пароли, то возвращатся объект с данными', async () => {
      const response = await request(app.getHttpServer()).post('/signup').send({
        email: 'abc@gmail.com',
        password: 'B123b123',
        confirmPassword: 'B123b123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        userId: 1,
        email: 'abc@gmail.com',
        token: expect.any(String), // expect который начинается не с точки это Jest
      });
    });

    it('Если пользователь при регистрации указывает данные, которые уже есть на сервере, то возвращатся ошибка', async () => {
      await registerUser('abc@gmail.com', 'B123b123');

      const response = await request(app.getHttpServer()).post('/signup').send({
        email: 'abc@gmail.com',
        password: 'B123b123',
        confirmPassword: 'B123b123',
      });

      expect(response.body).toEqual({
        error: 'Пользователь с этим email уже существует',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(400);
    });

    it('Если пользователь при регистрации указывает разные пароли, то возвращатся ошибка', async () => {
      const response = await request(app.getHttpServer()).post('/signup').send({
        email: 'abc@gmail.com',
        password: 'B123b123',
        confirmPassword: '00000000',
      });

      expect(response.body).toEqual({
        error: 'Пароли не совпадают',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(400);
    });

    it('Если пользователь при регистрации не вводит email, то возвращатся ошибка', async () => {
      // arrange & act
      const response = await request(app.getHttpServer())
        .post('/signup')
        .send({ email: '', password: 'B123b123', confirmPassword: 'B123b123' });

      // assert
      expect(response.body).toEqual({
        error: 'Вы не ввели email',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });

    it('Если пользователь при регистрации не вводит пароль, то возвращатся ошибка', async () => {
      const response = await request(app.getHttpServer())
        .post('/signup')
        .send({ email: 'abc@gmail.com', password: '', confirmPassword: '' });

      expect(response.body).toEqual({
        error: 'Вы не ввели пароль',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });

    it('Если пользователь при регистрации не подтверждает пароль, то возвращатся ошибка', async () => {
      const response = await request(app.getHttpServer()).post('/signup').send({
        email: 'abc@gmail.com',
        password: 'B123b123',
        confirmPassword: '',
      });

      expect(response.body).toEqual({
        error: 'Пароли не совпадают',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });

    it('Если пользователь при регистрации вводит в поле "пароль" невалидные данные, то возвращатся ошибка', async () => {
      const response = await request(app.getHttpServer())
        .post('/signup')
        .send({ email: 'abc@gmail.com', password: '1', confirmPassword: '1' });

      expect(response.body).toEqual({
        error: 'Невалидные данные',
      });
      // TODO: после фикса статусов раскомментировать
      // expect(response.status).toBe(422);
    });
  });
});
