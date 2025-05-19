import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(
      new JwtGuard(app.get(Reflector)),
      new RolesGuard(app.get(Reflector))
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
