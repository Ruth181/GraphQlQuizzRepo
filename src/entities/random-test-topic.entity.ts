import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RandomTest } from './random-test.entity';
import { Topic } from './topic.entity';

@ObjectType('RANDOM_TEST_TOPIC')
@Entity('RANDOM_TEST_TOPIC')
export class RandomTestTopic extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  topicId: string;

  @Field(() => Topic)
  @JoinColumn({ name: 'topicId' })
  @ManyToOne(() => Topic, (topic) => topic.randomTestTopicsForThisTopic)
  topic: Topic;

  @Column({ type: 'uuid' })
  randomTestId: string;

  @Field(() => RandomTest)
  @JoinColumn({ name: 'randomTestId' })
  @ManyToOne(
    () => RandomTest,
    (randomTest) => randomTest.topicsUnderThisRandomTest,
  )
  randomTest: RandomTest;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
  }
}
