import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { ResumeModule } from '@resume/resume.module';
import { InterviewModule } from '@interview/interview.module';
import { LearnModule } from '@learn/learn.module';
import { UserModule } from '@user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@common/jwt.guard';
import { JwtStrategy } from '@auth/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ResumeModule,
    InterviewModule,
    LearnModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
