import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
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
import { Answer } from './answer.entity';

@Entity('ANSWER_ATTACHMENT')
@ObjectType('ANSWER_ATTACHMENT')
export class AnswerAttachment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  answerId: string;

  @Field(() => Answer)
  @JoinColumn({ name: 'answerId' })
  @ManyToOne(() => Answer, (answer) => answer.attachmentsForThisAnswer)
  answer: Answer;

  @Field()
  @Column({ type: 'text' })
  link: string;

  @Field(() => FileType)
  @Column({ enum: FileType, default: FileType.IMAGE })
  fileType: FileType;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  stringPosition?: number;

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
