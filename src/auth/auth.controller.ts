import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import type { RegisterRequestDTO } from '@auth/dto/register-request.dto';
import { RegisterResponseDTO } from '@auth/dto/register-response.dto';
import { LoginResponseDTO } from '@auth/dto/login-response.dto';
import type { LoginRequestDTO } from '@auth/dto/login-request.dto';
import { Public } from '@common/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() req: LoginRequestDTO,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return await this.authService.login(req);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
