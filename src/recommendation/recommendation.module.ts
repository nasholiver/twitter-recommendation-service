import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { User } from '../user/user.entity';
import { Tweet } from '../tweet/tweet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tweet])],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}
