import { BaseRepositoryInterface } from '@support-center/shared/shared-types';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

export abstract class BaseRepositoryAbstract<T> implements BaseRepositoryInterface<T> {
  protected constructor(private readonly repository: Repository<T>) {}

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }

  async save(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(data);
  }

  async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.repository.save(data);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async remove(data: T): Promise<T> {
    return await this.repository.remove(data);
  }
}
