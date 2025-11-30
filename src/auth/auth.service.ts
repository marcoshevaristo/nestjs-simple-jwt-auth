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
    const user: UserEntity | null = await this.userService.findOneByEmail({
      email,
      includePassword: true,
    });
    if (!user) {
      throw new BadRequestException('User or password incorrect');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('User or password incorrect');
    }
    return user;
  }

  checkToken(token: string): Promise<boolean> {
    return this.jwtService.verify(token);
  }

  async register(user: RegisterRequestDTO): Promise<AccessToken> {
    const existingUser = await this.userService.findOneByEmail({
      email: user.email,
    });
    if (existingUser) {
      throw new BadRequestException('E-mail already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserDTO: CreateUserDTO = { ...user, password: hashedPassword };
    const createdUserEntity: UserEntity =
      await this.userService.create(newUserDTO);
    return this.login(createdUserEntity);
  }

  async login({ email, password }: LoginRequestDTO): Promise<AccessToken> {
    const userEntity = await this.validateUser(email, password);
    return { access_token: this.jwtService.sign(userEntity) };
  }
}
