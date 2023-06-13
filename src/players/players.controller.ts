import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePlayerDto);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.getPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayers(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    this.playersService.deletePlayer(_id);
  }
}
