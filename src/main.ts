import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: "somesecret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    })
  )
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(passport.initialize());
  app.use(passport.session())
  
  await app.listen(3000);
}
bootstrap();
