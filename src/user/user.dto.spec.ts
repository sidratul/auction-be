import { CreateUserDto } from './user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('CreateUserDto', () => {
  const data: CreateUserDto = {
    name: 'Sidratul',
    password: '123456',
    confirmPassword: '123456',
    email: 'sidratulmm@gmail.com',
  };

  it('should throw when email is invalid', async () => {
    const dto = plainToClass(CreateUserDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should throw when email is invalid', async () => {
    const invalidData = {
      ...data,
      email: 'sidratulmm',
    };

    const dto = plainToClass(CreateUserDto, invalidData);
    const errors = await validate(dto);
    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain(`email must be an email`);
  });
});
