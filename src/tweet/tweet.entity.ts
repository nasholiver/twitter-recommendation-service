import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tweetId: string;

  @Column('text')
  text: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  type: string; // 'reply', 'retweet', or 'original'

  @Column({ nullable: true })
  inReplyToUserId: string;

  @Column({ nullable: true })
  retweetedStatusUserId: string;

  @Column('simple-array')
  hashtags: string[];

  @Column({ default: 0 }) // New column for likes
  likes: number;

  @Column({ default: 0 }) // New column for retweets
  retweets: number;

  @ManyToOne(() => User, user => user.tweets)
  user: User;
}
