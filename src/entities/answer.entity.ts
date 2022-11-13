import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AnswerAttachment } from './answer-attachment.entity';
import { Question } from './question.entity';

@Entity('ANSWER')
@ObjectType('ANSWER')
export class Answer extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid' })
  questionId: string;

  @Field(() => Question)
  @JoinColumn({ name: 'questionId' })
  @ManyToOne(() => Question, (question) => question.answersForThisQuestion)
  question: Question;

  @Field()
  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field(() => [AnswerAttachment])
  @OneToMany(
    () => AnswerAttachment,
    (answerAttachment) => answerAttachment.answer,
  )
  attachmentsForThisAnswer: AnswerAttachment[];

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
    this.text = this.text.toUpperCase();
  }
}
