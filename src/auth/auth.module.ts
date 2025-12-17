import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@auth/auth.controller';
import { UserService } from '@user/user.service';

const defaultTokenValidity = '14400000'; // 4 hours

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: parseInt(
            process.env.JWT_EXPIRES_IN || defaultTokenValidity,
            10,
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
