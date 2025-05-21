import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({
    ttl: 5000, // milliseconds
    max: 100, // maximum number of items in cache
  })],
  providers: [CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}
