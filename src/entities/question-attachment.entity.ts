import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FileType } from '@utils/types/utils.types';
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
import { Question } from './question.entity';

@ObjectType('QUESTION_ATTACHMENT')
@Entity('QUESTION_ATTACHMENT')
export class QuestionAttachment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text' })
  link: string;

  @Field(() => FileType)
  @Column({ enum: FileType, default: FileType.IMAGE })
  fileType: FileType;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  stringPosition?: number;

  @Column({ type: 'uuid' })
  questionId: string;

  @Field(() => Question)
  @JoinColumn({ name: 'questionId' })
  @ManyToOne(() => Question, (question) => question.attachmentsForThisQuestion)
  question: Question;

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
