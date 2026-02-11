export interface BaseServiceInterface<T> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
}
