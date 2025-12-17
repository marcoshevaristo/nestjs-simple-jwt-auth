import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';
import dbClient from '@common/db-client';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity, userEntitySchema } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly table = 'users';

  async create(createUserDto: CreateUserDTO): Promise<UserEntity> {
    const fields: Array<keyof UserEntity> = ['name', 'email', 'password'];
    const result = await dbClient.query(
      `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at, ${fields.join(', ')}`,
      [createUserDto.name, createUserDto.email, createUserDto.password],
    );
    return userEntitySchema.parse(result.rows[0]);
  }

  async findAll(): Promise<UserEntity[]> {
    const fields: Array<keyof UserEntity> = [
      'id',
      'name',
      'email',
      'password',
      'created_at',
      'updated_at',
    ];
    const result = await dbClient.query(
      `SELECT ${fields.join(', ')} FROM ${this.table}`,
    );
    return userEntitySchema
      .array()
      .parse(
        result.rows.map((row: UserEntity) => ({ ...row, password: 'hidden' })),
      );
  }

  async findOne(id: string): Promise<UserEntity | null> {
    const fields: Array<keyof UserEntity> = [
      'id',
      'name',
      'email',
      'created_at',
      'updated_at',
    ];
    const result = await dbClient.query(
      `SELECT ${fields.join(', ')} FROM ${this.table} WHERE id = $1`,
      [id],
    );
    if (!result.rows.length) {
      return null;
    }
    return userEntitySchema.parse({ ...result.rows[0], password: 'hidden' });
  }

  async findOneByEmail({
    email,
    includePassword = false,
  }: {
    email: string;
    includePassword?: boolean;
  }): Promise<UserEntity | null> {
    const fields: Array<keyof UserEntity> = [
      'id',
      'name',
      'email',
      'password',
      'created_at',
      'updated_at',
    ];
    const query = `SELECT ${fields.join(', ')} FROM ${this.table} WHERE email = $1`;
    try {
      const result = await dbClient.query<UserEntity>(query, [email]);
      if (!result.rows.length) {
        return null;
      }
      return userEntitySchema.parse({
        ...result.rows[0],
        password: includePassword ? result.rows[0].password : 'hidden',
      });
    } catch (error) {
      console.error('Database query error:', error);
      console.log('Executed query:', query, 'with email:', email);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDTO): Promise<UserEntity> {
    const fields: Array<keyof UserEntity> = ['name', 'email', 'password'];
    const setString = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');
    const values = fields.map(
      (field) => updateUserDto[field as keyof UpdateUserDTO],
    );
    values.push(id);

    const result = await dbClient.query(
      `UPDATE ${this.table} SET ${setString}, "updatedAt" = NOW() WHERE id = $${
        values.length
      } RETURNING id, name, email, createdAt, updatedAt`,
      values,
    );
    return userEntitySchema.parse({ ...result.rows[0], password: 'hidden' });
  }

  async remove(id: string): Promise<number | null> {
    const result = await dbClient.query(
      `DELETE FROM ${this.table} WHERE id = $1`,
      [id],
    );
    return result.rowCount;
  }
}
