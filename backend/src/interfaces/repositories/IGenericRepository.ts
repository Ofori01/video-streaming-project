import { FindManyOptions, FindOneOptions } from "typeorm";

export interface IGenericRepository<T> {
  Create(entity: T): Promise<T>;
  GetAll(options?: FindManyOptions<T>): Promise<T[]>;
  GetOne(options: FindOneOptions<T>): Promise<T| null>;
  GetById(id: number, options?: FindOneOptions<T>): Promise<T>;
  Update(id: number, entity: T): Promise<T>;
  Delete(id: number): Promise<void>;
}
