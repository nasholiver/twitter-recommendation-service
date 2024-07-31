// create-tweet.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class CreateUserDto {
  @ApiProperty()
  id_str: string;

  @ApiProperty()
  screen_name: string;

  @ApiProperty({ required: false })
  description?: string;
}

class CreateEntitiesDto {
  @ApiProperty({ type: [String] })
  hashtags: { text: string }[];
}

export class CreateTweetDto {
  @ApiProperty()
  id_str: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ required: false })
  in_reply_to_status_id?: string;

  @ApiProperty({ required: false })
  in_reply_to_user_id_str?: string;

  @ApiProperty({ required: false })
  retweeted_status?: { user: { id_str: string } };

  @ApiProperty({ type: CreateUserDto })
  user: CreateUserDto;

  @ApiProperty({ type: CreateEntitiesDto })
  entities: CreateEntitiesDto;
}
