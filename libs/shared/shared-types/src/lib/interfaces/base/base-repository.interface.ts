export interface BaseRepositoryInterface<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
}

import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
