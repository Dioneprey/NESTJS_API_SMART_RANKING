import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: Array<IEvent>;
  players: Array<Player>;
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
