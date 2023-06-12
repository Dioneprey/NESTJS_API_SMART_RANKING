import { Controller, Post, Body, Get, Delete, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.getPlayerByEmail(email);
    }
    return await this.playersService.getAllPlayers();
  }

  @Delete()
  async deletePlayers(@Query('email') email: string): Promise<void> {
    this.playersService.deletePlayer(email);
  }
}
