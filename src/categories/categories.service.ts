import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryFound = await this.findOneByIndex('category', category);

    if (categoryFound) {
      throw new BadRequestException(`Category ${category} already exists`);
    }

    const createdCategory = new this.categoryModel(createCategoryDto);
    return await createdCategory.save();
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoryById(category: string): Promise<Category> {
    const categoryFound = await this.findOneByIndex('category', category);

    if (!categoryFound) {
      throw new BadRequestException(`Category ${category} not found`);
    }

    return categoryFound;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const categoryFound = await this.findOneByIndex('category', category);

    if (!categoryFound) {
      throw new BadRequestException(`Category ${category} not found`);
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async getCategoryPlayer(_id: any): Promise<{ Category: string }> {
    const playerId = _id.playerId;
    await this.playersService.getPlayerById(playerId);

    const isPlayerRegistered = await this.categoryModel
      .find()
      .where('players')
      .in([playerId])
      .exec();

    if (isPlayerRegistered.length == 0) {
      throw new BadRequestException(
        `Player ${playerId} is not in any category`,
      );
    }

    const category = isPlayerRegistered[0]?.category;
    return { Category: category };
  }

  async setCategoryPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const categoryFound = await this.findOneByIndex('category', category);

    if (!categoryFound) {
      throw new BadRequestException(`Category ${category} not found`);
    }

    await this.playersService.getPlayerById(playerId);

    const playerAlreadyRegistered = await this.categoryModel
      .find({ category })
      .where('players')
      .in(playerId)
      .exec();

    if (playerAlreadyRegistered?.length > 0) {
      throw new BadRequestException(
        `Player ${playerId} already registered in category ${category}`,
      );
    }

    categoryFound.players.push(playerId);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();
  }

  private async findOneByIndex(
    indexField: string,
    indexValue: string,
  ): Promise<Category> {
    const query = { [indexField]: indexValue };
    return await this.categoryModel.findOne(query).exec();
  }
}
