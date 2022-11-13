import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { Department } from '@entities/department.entity';

export const departmentForUserLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    return await getRepository(Department)
      .createQueryBuilder('department')
      .where('department.id IN (:...keys)', { keys })
      .getMany();
  });
};

export const quizSessionsForUserLoader = () =>
  new Dataloader(async (keys: string[]) => {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.quizSessionsForThisUser',
        'quizSessionsForThisUser',
      )
      .where('user.id IN (:...keys)', { keys })
      .getMany();
    return user.map(({ quizSessionsForThisUser }) => quizSessionsForThisUser);
  });

export const randomTestQuizRecordForUserLoader = () =>
  new Dataloader(async (keys: string[]) => {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.randomTestsTakenByThisUser',
        'randomTestsTakenByThisUser',
      )
      .where('user.id IN (:...keys)', { keys })
      .getMany();
    return user.map(
      ({ randomTestsTakenByThisUser }) => randomTestsTakenByThisUser,
    );
  });
