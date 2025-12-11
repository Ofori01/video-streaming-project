import { Options } from "pg-connection-string";
import { EntityTarget, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Repository } from "typeorm";
import { IGenericRepository } from "../interfaces/repositories/IGenericRepository";
import { BaseEntity } from "../entities/BaseEntity";
import { AppDataSource } from "../config/db.config";

export abstract class GenericRepository<T extends BaseEntity>
  implements IGenericRepository<T>
{
  protected repository: Repository<T>; 

  constructor(private Entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(this.Entity);
  }

  async Create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async GetOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options)
  }

  async GetAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async GetById(id: number, options: FindOneOptions<T>): Promise<T> {
    const findOptions = {...options, where: {id: id} } as FindOneOptions<T>;
    return await this.repository.findOneOrFail(findOptions);
  }

  async Update(id: number, entity: T): Promise<T> {
    await this.repository.update(id, entity as any);
    return entity;
  }

  async Delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  protected getEntityType(): EntityTarget<T> {
    return this.Entity;
  }
}
