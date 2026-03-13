import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.recipe.findMany({
      include: { ingredients: { include: { inventory: true } }, menuItems: true },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: { include: { inventory: true } }, menuItems: true },
    });
    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  async create(dto: CreateRecipeDto) {
    const { ingredients, ...recipeData } = dto;
    return this.prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: { create: ingredients },
      },
      include: { ingredients: true },
    });
  }

  async update(id: string, dto: Partial<CreateRecipeDto>) {
    await this.findOne(id);
    const { ingredients, ...recipeData } = dto;
    if (ingredients) {
      await this.prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    }
    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        ...(ingredients && { ingredients: { create: ingredients } }),
      },
      include: { ingredients: { include: { inventory: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.recipe.delete({ where: { id } });
  }
}
