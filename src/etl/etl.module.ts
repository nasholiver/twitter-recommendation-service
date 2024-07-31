// etl.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ETLService } from './etl.service';
import { ETLController } from './etl.controller';
import { User } from '../user/user.entity';
import { Tweet } from '../tweet/tweet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tweet]),
  ],
  controllers: [ETLController],  // Add ETLController here
  providers: [ETLService],
  exports: [ETLService],
})
export class ETLModule {}
