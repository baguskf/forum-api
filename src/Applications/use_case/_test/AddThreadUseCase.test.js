import { describe, it, expect, vi } from 'vitest';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate add thread correctly', async () => {

    const payload = {
      title: 'sebuah thread',
      body: 'isi thread',
    };

    const owner = 'user-123';

    const mockThreadRepository = {
      addThread: vi.fn().mockResolvedValue({
        id: 'thread-123',
        title: payload.title,
        owner,
      }),
    };

    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });


    const result = await useCase.execute(payload, owner);


    expect(result).toEqual({
      id: 'thread-123',
      title: payload.title,
      owner,
    });


    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: payload.title,
      body: payload.body,
      owner,
    });
  });
});