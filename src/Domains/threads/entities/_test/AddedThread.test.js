import AddedThread from '../AddedThread.js';

describe('AddedThread entities', () => {
  it('should throw error when payload not complete', () => {
    expect(() => new AddedThread({ id: 'id' }))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create AddedThread correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    };

    const result = new AddedThread(payload);

    expect(result.id).toBe('thread-123');
    expect(result.title).toBe('title');
    expect(result.owner).toBe('user-123');
  });
});