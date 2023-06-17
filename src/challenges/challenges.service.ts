import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengerDto } from './dtos/update-challenge.dto';
import { SetChallengeMatchDto } from './dtos/set-challenge-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDto: CreateChallengerDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers();

    createChallengeDto.players.map((playeyDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playeyDto._id,
      );

      if (playerFilter.length === 0) {
        throw new BadRequestException(
          `Player with id ${playeyDto._id} does not exist`,
        );
      }
    });

    const requesterIsPlayerOfMatch = await createChallengeDto.players.filter(
      (player) => player._id === createChallengeDto.requester,
    );

    this.logger.log(
      `requesterIsPlayerOfMatch: ${requesterIsPlayerOfMatch[0]._id}`,
    );

    if (requesterIsPlayerOfMatch.length == 0) {
      throw new BadRequestException(`The requester must be a player of match`);
    }

    const playerCategory = await this.categoriesService.getCategoryPlayer(
      createChallengeDto.requester,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        `The requester must be registered in a category`,
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = playerCategory.category;
    createdChallenge.dateTimeRequest = new Date();

    createdChallenge.status = ChallengeStatus.PENDING;
    this.logger.log(`createdChallenge: ${createdChallenge}`);
    return await createdChallenge.save();
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async getChallengesPlayer(_id: any): Promise<Array<Challenge>> {
    await this.playersService.getPlayerById(_id);

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengerDto,
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge ${_id} not found`);
    }

    if (challengeFound.status == 'REALIZED') {
      throw new BadRequestException(`Challenge ${_id} is over`);
    }
    if (updateChallengeDto.status) {
      challengeFound.dateTimeResponse = new Date();
    }
    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: updateChallengeDto })
      .exec();
  }

  async setChallengeMatch(
    _id: string,
    setChallengeMatchDto: SetChallengeMatchDto,
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge ${_id} not found`);
    }

    if (challengeFound.status == 'REALIZED') {
      throw new BadRequestException(`Challenge ${_id} is over`);
    }

    if (challengeFound.status == 'CANCELED') {
      throw new BadRequestException(`Challenge ${_id} was canceled`);
    }

    const playerFilter = challengeFound.players.filter(
      (player) => player._id == setChallengeMatchDto.def,
    );
    this.logger.log(`challengeFound ${challengeFound}`);
    this.logger.log(`playerFilter ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `Player ${_id} does not participate in this match`,
      );
    }

    // Creating and persisting a new match Object

    const createdMatch = new this.matchModel(setChallengeMatchDto);

    // Setting the category recovered from the challenge to new match object

    createdMatch.category = challengeFound.category;

    // Setting the players recovered from the challenge to new match object

    createdMatch.players = challengeFound.players;

    const result = await createdMatch.save();

    // When a match is registered by a user, we'll change the status of the challenge to realized

    challengeFound.status = ChallengeStatus.REALIZED;

    // We take the match ID and assign the challenge

    challengeFound.match = result._id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .exec();
    } catch (error) {
      // If update failed, we'll delete the match record previously
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenger(_id: string): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenger ${_id} not found`);
    }

    // We will do a logical removal of the challenger, changing the status to CANCELED

    challengeFound.status = ChallengeStatus.CANCELED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }
}
