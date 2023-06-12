import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dione:2Kw418YdXOTmMBVL@nest-api-db.vqfmdcm.mongodb.net/smartranking',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
