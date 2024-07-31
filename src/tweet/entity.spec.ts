import { Tweet } from './tweet.entity';

describe('Tweet Entity', () => {
  it('should create a tweet entity', () => {
    const tweet = new Tweet();
    tweet.tweetId = 'tweet123';
    tweet.text = 'This is a tweet';
    tweet.createdAt = new Date();

    expect(tweet).toBeDefined();
    expect(tweet.tweetId).toEqual('tweet123');
  });
});
