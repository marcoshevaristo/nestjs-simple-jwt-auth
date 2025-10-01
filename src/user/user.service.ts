import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';
import dbClient from '@common/db-client';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity, userEntitySchema } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly table = 'users';

  async create(createUserDto: CreateUserDTO): Promise<UserEntity> {
    const fields = ['name', 'email', 'password'];
    const result = await dbClient.query(
      `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES ($1, $2, $3) RETURNING id`,
      [createUserDto.name, createUserDto.email, createUserDto.password],
    );
    return userEntitySchema.parse(result.rows[0]);
  }

  async findAll(): Promise<UserEntity[]> {
    const fields = ['name', 'email', 'password', 'createdAt', 'updatedAt'];
    const result = await dbClient.query(
      `SELECT ${fields.join(', ')} FROM ${this.table}`,
    );
    return userEntitySchema.array().parse(result.rows);
  }

  async findOne(id: string): Promise<UserEntity | null> {
    const fields = ['id', 'name', 'email', 'createdAt', 'updatedAt'];
    const result = await dbClient.query(
      `SELECT ${fields.join(', ')} FROM ${this.table} WHERE id = $1`,
      [id],
    );
    if (!result.rows.length) {
      return null;
    }
    return userEntitySchema.parse(result.rows[0]);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    const fields = ['id', 'name', 'email', 'createdAt', 'updatedAt'];
    const result = await dbClient.query(
      `SELECT ${fields.join(', ')} FROM ${this.table} WHERE email = $1`,
      [email],
    );
    if (result.rows.length) {
      return null;
    }
    return userEntitySchema.parse(result.rows[0]);
  }

  async update(id: string, updateUserDto: UpdateUserDTO): Promise<UserEntity> {
    const fields = ['name', 'email', 'password'];
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
    return userEntitySchema.parse(result.rows[0]);
  }

  async remove(id: string): Promise<number | null> {
    const result = await dbClient.query(
      `DELETE FROM ${this.table} WHERE id = $1`,
      [id],
    );
    return result.rowCount;
  }
}
