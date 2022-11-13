import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Answer } from './answer.entity';
import { QuestionAttachment } from './question-attachment.entity';
import { QuestionCourseTopic } from './question-course-topic.entity';
import { QuizSessionDetail } from './quiz-session-detail.entity';

@ObjectType('QUESTION')
@Entity('QUESTION')
export class Question extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text' })
  text: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  isSingleChoiceAnswer: boolean;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [QuestionAttachment])
  @OneToMany(
    () => QuestionAttachment,
    (questionAttachment) => questionAttachment.question,
  )
  attachmentsForThisQuestion: QuestionAttachment[];

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question)
  answersForThisQuestion: Answer[];

  @Field(() => [QuestionCourseTopic])
  @OneToMany(
    () => QuestionCourseTopic,
    (questionCourseTopic) => questionCourseTopic.question,
  )
  questionTopicRecordsForThisQuestion: QuestionCourseTopic[];

  @Field(() => [QuizSessionDetail])
  @OneToMany(
    () => QuizSessionDetail,
    (quizSessionDetail) => quizSessionDetail.question,
  )
  quizSessionDetailsForThisQuestion: QuizSessionDetail[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
    if (this.text) {
      this.text = this.text.toUpperCase();
      if (!this.text.endsWith('?')) {
        this.text = `${this.text}?`;
      }
    }
  }
}
