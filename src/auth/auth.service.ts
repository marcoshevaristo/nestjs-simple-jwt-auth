import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './types/AccessToken';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDTO } from '@user/dto/create-user.dto';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { LoginRequestDTO } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity | null =
      await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('UserEntity not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserDTO: CreateUserDTO = { ...user, password: hashedPassword };
    const createdUserEntity = await this.userService.create(newUserDTO);
    return this.login(createdUserEntity);
  }

  login(user: LoginRequestDTO): AccessToken {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
