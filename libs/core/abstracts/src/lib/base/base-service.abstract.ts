import { BaseServiceInterface } from '@support-center/shared/shared-types';
import { BaseRepositoryAbstract } from './base-repository.abstract';

export abstract class BaseServiceAbstract<T> implements BaseServiceInterface<T> {
  protected constructor(private readonly repository: BaseRepositoryAbstract<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<T | null> {
    // Assuming 'id' is the primary key and the entity has an 'id' field.
    // This simple implementation might need adjustment based on entity structure.
    return await this.repository.findOne({ where: { id } as any });
  }
}
