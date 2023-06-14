import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
// import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';
@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const playerFound = await this.findOneByIndex('_id', _id);
    if (!playerFound) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }
    return playerFound;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerFound = await this.findOneByIndex('email', email);

    if (playerFound) {
      throw new BadRequestException(
        `Player with email ${email} already exists`,
      );
    }
    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    try {
      const playerFound = await this.findOneByIndex('_id', _id);

      if (!playerFound) {
        throw new NotFoundException(`Player with id ${_id} not found`);
      }
      await this.playerModel
        .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
        .exec();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deletePlayer(_id: string): Promise<any> {
    const playerFound = await this.findOneByIndex('_id', _id);
    if (!playerFound) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }
    return await this.playerModel.deleteOne({ _id }).exec();
  }

  private async findOneByIndex(
    indexField: string,
    indexValue: string,
  ): Promise<Player> {
    const query = { [indexField]: indexValue };
    return await this.playerModel.findOne(query).exec();
  }
}
