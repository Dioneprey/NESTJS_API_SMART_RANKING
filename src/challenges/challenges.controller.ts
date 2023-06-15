import {
  Body,
  Controller,
  Logger,
  Get,
  Put,
  Post,
  Query,
  Param,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/challenge.interface';
import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { UpdateChallengerDto } from './dtos/update-challenge.dto';
import { SetChallengeMatchDto } from './dtos/set-challenge-match.dto';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengerDto,
  ): Promise<Challenge> {
    this.logger.log(`CreateChallenge: ${JSON.stringify(createChallengeDto)}`);
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(
    @Query('playerId') _id: string,
  ): Promise<Array<Challenge | Challenge[]>> {
    return _id
      ? await this.challengesService.getChallengesPlayer(_id)
      : await this.challengesService.getAllChallenges();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe)
    updateChallengeDto: UpdateChallengerDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match')
  async setChallengeMatch(
    @Body(ValidationPipe) setChallengeMatchDto: SetChallengeMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.setChallengeMatch(
      _id,
      setChallengeMatchDto,
    );
  }

  @Delete('/:_id')
  async deletePlayers(
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<void> {
    this.challengesService.deleteChallenger(_id);
  }
}
