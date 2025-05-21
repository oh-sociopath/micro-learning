import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { CoursesModule } from './courses/courses.module';
import { QaModule } from './qa/qa.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ArchiveQuestionsTask } from './tasks/archive-questions.task';
import { LoggerMiddleware } from './middlware/logger.middlware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ThrottlerModule.forRoot([{
      ttl: 600, // 10 m
      limit: 100, // max requests per ip
    }]),
    AuthModule,
    PrismaModule,
    UserModule,
    CoursesModule,
    QaModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ArchiveQuestionsTask
  ],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
