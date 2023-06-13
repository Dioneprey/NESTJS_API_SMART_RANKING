import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    ranking: String,
    rankingPosition: Number,
    urlAvatar: String,
  },
  { timestamps: true, collection: 'players' },
);
