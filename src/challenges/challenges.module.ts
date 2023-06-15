import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenger', schema: ChallengeSchema },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
