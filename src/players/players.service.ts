import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`createPlayerDto: ${createPlayerDto}`);
    await this.create(createPlayerDto);
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { name, phone, email } = createPlayerDto;

    const player: Player = {
      _id: uuidv4(),
      name,
      phone,
      email,
      ranking: `A`,
      rankingPosition: 1,
      urlAvatar: `www.google.com.gr/foto123.jpg`,
    };
    this.players.push(player);
  }
}
