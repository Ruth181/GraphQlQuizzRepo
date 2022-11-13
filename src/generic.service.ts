import { Logger, Type } from '@nestjs/common';
import { Repository, FindConditions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessageList } from '@utils/types/utils.types';

export type Constructor<I> = new (...args: any[]) => I; // Main Point

export interface IDataService<T> {
  readonly repo: Repository<T>;

  logger: Logger;

  remove(obj: T): Promise<void>;

  create<U>(obj: U): Promise<T>;

  createMany<U>(objs: U[]): Promise<T[]>;

  findOne<U>(predicate: FindConditions<T>): Promise<T>;

  findOneWithOptionalConditions<U>(
    ...predicates: FindConditions<T>[]
  ): Promise<T>;

  findAllByCondition(predicate: FindConditions<T>): Promise<T[]>;

  findAllWithOptionalConditions(
    ...predicates: FindConditions<T>[]
  ): Promise<T[]>;

  findAll(): Promise<T[]>;

  findAllWithRelations(...relations: string[]): Promise<T[]>;

  delete<U>(predicate: FindConditions<T>): Promise<void>;

  getRepo(): Repository<T>;
}

export function GenericService<T>(
  entity: Constructor<T>,
): Type<IDataService<T>> {
  class GenericServiceHost implements IDataService<T> {
    @InjectRepository(entity) public readonly repo: Repository<T>;
    logger: Logger;

    constructor(loggerLabel: string) {
      this.logger = new Logger(loggerLabel);
    }

    async remove(obj: T): Promise<void> {
      try {
        await this.repo.remove(obj);
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    /**
     * U: represents the DTO used for creating new User
     * @param obj
     */
    async create<U>(obj: U | any): Promise<T> {
      try {
        const createdEntity: T | any = await this.repo.create(obj);
        await this.repo.save(createdEntity);
        return createdEntity;
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    async createMany<U>(objs: U[] | any[]): Promise<T[]> {
      try {
        const createdObjects: T[] = [];
        for (const obj of objs) {
          const createdObject = await this.create(obj);
          createdObjects.push(createdObject);
        }
        return createdObjects;
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    async findOne<U>(predicate: FindConditions<T>): Promise<T> {
      try {
        return await this.repo.findOne({
          where: predicate,
        });
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    async findOneWithOptionalConditions<U>(
      ...predicates: FindConditions<T>[]
    ): Promise<T> {
      try {
        return await this.repo.findOne({
          where: [...predicates],
        });
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    /**
             * 
             * @param predicate 
             * I.E:
             *  await this.findAllByCondition<string | number | Date>({
                        name: "Jerome",
                        age: 44,
                        sex: 8,
                        date: new Date()
                })
             */
    async findAllByCondition(predicate: FindConditions<T>): Promise<T[]> {
      try {
        return await this.repo.find({
          where: predicate,
        });
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    /**
             * await this.findAllWithOptionalConditions<string | number | Date, string | number | Date>({
                        name: "Jerom",
                        age: 44,
                        sex: 8,
                        date: new Date()
                },
                {
                        name: "Jerome",
                        age: 44,
                        sex: 8,
                        date: new Date()
                })
             * Using OR condition
             * @param predicates
             * Takes as many Predicates as possible
             */
    async findAllWithOptionalConditions(
      ...predicates: FindConditions<T>[]
    ): Promise<T[]> {
      try {
        return await this.repo.find({
          where: [...predicates],
        });
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    async findAll(): Promise<T[]> {
      try {
        return await this.repo.find({});
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    async findAllWithRelations(...relations: string[]): Promise<T[]> {
      try {
        return await this.repo.find({
          relations: [...relations],
        });
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    /**
     *
     * @param predicate
     * predicate must match 1 of the column names for this entity,
     * which is then used to delete the given record
     * I.E:
     * const Id: string = "12345";
     * this.delete<string>({ Id });
     */
    async delete(predicate: FindConditions<T>): Promise<void> {
      try {
        await this.repo.delete(predicate);
      } catch (ex) {
        this.logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
        throw ex;
      }
    }

    getRepo(): Repository<T> {
      return this.repo;
    }
  }

  return GenericServiceHost;
}
