import { FindManyOptions, FindOneOptions } from "typeorm";



export interface IGenericService<Entity> {
  Create(entity: Entity): Promise<Entity>;
  GetAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  GetOne(options: FindOneOptions<Entity>): Promise<Entity | null>;
  GetById(id: number, options: FindOneOptions<Entity>): Promise<Entity>;
  Update(id: number, entity: Entity): Promise<Entity>;
  Delete(id: number): Promise<void>;
}