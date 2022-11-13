import { Department } from '@entities/department.entity';
import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';

export const usersForDepartmentLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const department = await getRepository(Department)
      .createQueryBuilder('department')
      .leftJoinAndSelect(
        'department.usersUnderThisDepartment',
        'usersUnderThisDepartment',
      )
      .where('department.id IN (:...keys)', { keys })
      .getMany();
    return department.map(
      ({ usersUnderThisDepartment }) => usersUnderThisDepartment,
    );
  });
};

export const coursesForDepartmentLoader = () => {
  return new Dataloader(async (keys: string[]) => {
    const department = await getRepository(Department)
      .createQueryBuilder('department')
      .leftJoinAndSelect(
        'department.coursesUnderThisDepartment',
        'coursesUnderThisDepartment',
      )
      .where('department.id IN (:...keys)', { keys })
      .getMany();
    // const department = await getRepository(Department).find({
    //   where: { id: In(keys) },
    //   relations: ['coursesUnderThisDepartment'],
    // });
    return department.map(
      ({ coursesUnderThisDepartment }) => coursesUnderThisDepartment,
    );
  });
};
// export const coursesForDepartmentLoader = () => {
//   return new Dataloader(async (keys: string[]) => {
//     console.log({ keys });
//     const toga = await getRepository(Course)
//       .createQueryBuilder('course')
//       .where('course.departmentId IN (:...keys)', { keys })
//       .getMany();
//     console.log({ toga });
//     return toga;
//   });
// };
