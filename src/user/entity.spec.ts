import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user entity', () => {
    const user = new User();
    user.userId = '123';
    user.screenName = 'testUser';
    user.description = 'Test description';

    expect(user).toBeDefined();
    expect(user.userId).toEqual('123');
    expect(user.screenName).toEqual('testUser');
  });
});
