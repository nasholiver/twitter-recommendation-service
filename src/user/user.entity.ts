import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tweet } from '../tweet/tweet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;  // from Twitter data

  @Column()
  screenName: string;

  @Column('text')
  description: string;

  @OneToMany(() => Tweet, tweet => tweet.user)
  tweets: Tweet[];
}
