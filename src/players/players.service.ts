import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const playerFound = this.players.find((player) => player.email === email);

    if (playerFound) {
      return this.update(playerFound, createPlayerDto);
    }
    await this.create(createPlayerDto);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFound = this.players.find((player) => player.email === email);
    if (!playerFound) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }
    return playerFound;
  }

  async deletePlayer(email: string): Promise<void> {
    const playerFound = this.players.find((player) => player.email === email);

    this.players = this.players.filter(
      (player) => player.email !== playerFound.email,
    );
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
    this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(playerFound: Player, createPlayerDto: CreatePlayerDto): void {
    const { name } = createPlayerDto;

    playerFound.name = name;
  }
}
