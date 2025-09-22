import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDTO } from '@auth/dto/register-request.dto';
import { RegisterResponseDTO } from '@auth/dto/register-response.dto';
import { LoginResponseDTO } from '@auth/dto/login-response.dto';
import { LoginRequestDTO } from '@auth/dto/login-request.dto';
import { Public } from '@common/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(
    @Request() req: LoginRequestDTO,
  ): LoginResponseDTO | BadRequestException {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
