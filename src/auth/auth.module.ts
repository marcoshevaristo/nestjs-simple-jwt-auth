import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '@auth/strategy/local.strategy';
import { AuthController } from '@auth/auth.controller';
import { JwtStrategy } from '@auth/strategy/jwt.strategy';
import { UserService } from '@user/user.service';

const defaultTokenValidity = '14400'; // 4 hours

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
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
