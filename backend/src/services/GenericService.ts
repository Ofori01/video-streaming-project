import { IGenericRepository } from "../interfaces/repositories/IGenericRepository";
import { IGenericService } from "../interfaces/services/IGenericService";
import { BaseEntity } from "../entities/BaseEntity";
import { FindManyOptions } from "typeorm";

export abstract class GenericService<T extends BaseEntity>
  implements IGenericService<T>
{
  constructor(protected _repository: IGenericRepository<T>) {}

  async Create(entity: T): Promise<T> {
    return await this._repository.Create(entity);
  }
  async GetAll(options?: FindManyOptions): Promise<T[]> {
    return await this._repository.GetAll(options);
  }

  async GetById(id: number): Promise<T> {
    return await this._repository.GetById(id);
  }
  async Update(id: number, entity: T): Promise<T> {
    return await this._repository.Update(id, entity);
  }
  async Delete(id: number): Promise<void> {
    return await this._repository.Delete(id);
  }
}
