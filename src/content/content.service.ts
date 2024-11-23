import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const content = this.contentRepository.create(createContentDto);
    await this.contentRepository.save(content);
    return content;
  }

  async findAll() {
    return this.contentRepository.find();
  }

  async findOne(id: number) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    const content = await this.contentRepository.preload({
      id,
      ...updateContentDto,
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return this.contentRepository.save(content);
  }

  async remove(id: number) {
    const content = await this.findOne(id);
    return this.contentRepository.remove(content);
  }
}