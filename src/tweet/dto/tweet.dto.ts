// tweet.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  screenName: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class TweetDto {
  @ApiProperty()
  tweetId: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  inReplyToUserId?: string;

  @ApiProperty({ required: false })
  retweetedStatusUserId?: string;

  @ApiProperty({ type: [String] })
  hashtags: string[];

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
