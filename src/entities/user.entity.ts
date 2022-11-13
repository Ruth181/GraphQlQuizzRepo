import { ObjectType, Field, ID } from '@nestjs/graphql';
import { hashPassword } from '@utils/functions/utils.function';
import { DEFAULT_PASSPORT_LINK, AppRole } from '@utils/types/utils.types';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Department } from './department.entity';
import { QuizSession } from './quiz-session.entity';
import { RandomTestQuizRecord } from './random-test-quiz-record.entity';

@ObjectType('USER')
@Entity('USER')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Field()
  @Column({ type: 'text', default: DEFAULT_PASSPORT_LINK })
  profileImageUrl: string;

  @Field(() => AppRole)
  @Column({ enum: AppRole, default: AppRole.USER })
  role: AppRole;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  uniqueVerificationCode: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  jwtRefreshToken: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'uuid', nullable: true })
  departmentId: string;

  @Field(() => Department, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  @ManyToOne(
    () => Department,
    (department) => department.usersUnderThisDepartment,
  )
  department: Department;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [QuizSession])
  @OneToMany(() => QuizSession, (quizSession) => quizSession.user)
  quizSessionsForThisUser: QuizSession[];

  @Field(() => [RandomTestQuizRecord])
  @OneToMany(
    () => RandomTestQuizRecord,
    (randomTestQuizRecord) => randomTestQuizRecord.user,
  )
  randomTestsTakenByThisUser: RandomTestQuizRecord[];

  @BeforeInsert()
  async beforeInsertHandler(): Promise<void> {
    this.id = uuidv4();
    this.jwtRefreshToken = uuidv4();
    this.password = this.password ? this.password : '1234567';
    this.password = await hashPassword(this.password);
  }
}
