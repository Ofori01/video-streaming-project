import { Options } from "pg-connection-string";
import { EntityTarget, FindOptionsWhere, Repository } from "typeorm";
import { IGenericRepository } from "../interfaces/repositories/IGenericRepository";
import { BaseEntity } from "../lib/Generics/BaseEntity";
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

  async GetAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async GetById(id: number): Promise<T> {
    const options = { where: { id: id } as FindOptionsWhere<T> };
    return await this.repository.findOneOrFail(options);
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
