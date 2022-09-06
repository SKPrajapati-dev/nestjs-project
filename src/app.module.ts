import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TweetsModule } from './tweets/tweets.module';
import { Tweet } from './tweets/tweets.entity';
import { LikesModule } from './likes/likes.module';
import { Like } from './likes/likes.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Tweet, Like],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    TweetsModule,
    LikesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
