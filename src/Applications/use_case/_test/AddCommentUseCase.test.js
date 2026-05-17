import { describe, it, expect, vi } from 'vitest';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should orchestrate add comment correctly', async () => {
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = {
      addComment: vi.fn().mockResolvedValue({
        id: 'comment-123',
        content: payload.content,
        owner: payload.owner,
      }),
    };

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
    };

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const result = await useCase.execute(payload);

    expect(result).toEqual({
      id: 'comment-123',
      content: payload.content,
      owner: payload.owner,
    });

    expect(mockThreadRepository.verifyThreadExists)
      .toBeCalledWith(payload.threadId);

    expect(mockCommentRepository.addComment)
      .toBeCalledWith({
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.owner,
      });
  });
});