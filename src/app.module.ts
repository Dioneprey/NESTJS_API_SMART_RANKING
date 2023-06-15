import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dione:xawK6H9yYLVuvx7G@nest-api-db.vqfmdcm.mongodb.net/smartranking?retryWrites=true&w=majority',
    ),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
