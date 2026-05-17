import AddThread from '../AddThread.js';

describe('AddThread entities', () => {
  it('should throw error when payload not complete', () => {
    expect(() => new AddThread({ title: 'title' }))
      .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type not match', () => {
    expect(() => new AddThread({ title: 123, body: true }))
      .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread correctly', () => {
    const payload = { title: 'title', body: 'body' };

    const result = new AddThread(payload);

    expect(result.title).toBe('title');
    expect(result.body).toBe('body');
  });
});