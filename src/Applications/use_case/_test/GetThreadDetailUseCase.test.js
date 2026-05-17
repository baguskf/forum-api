import { describe, it, expect, vi } from 'vitest';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
describe('GetThreadDetailUseCase', () => {

  const mockThread = {
    id: 'thread-123',
    title: 'Judul Thread',
    body: 'Isi thread',
    created_at: '2024-01-01T00:00:00.000Z',
    username: 'dicoding',
  };

  const mockComments = [
    {
      id: 'comment-123',
      username: 'johndoe',
      date: '2024-01-02T00:00:00.000Z',
      content: 'Komentar pertama',
      is_delete: false,
    },
    {
      id: 'comment-456',
      username: 'janedoe',
      date: '2024-01-03T00:00:00.000Z',
      content: 'Komentar yang sudah dihapus',
      is_delete: true,
    },
  ];

  const makeMocks = () => ({
    mockThreadRepository: {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    },
    mockCommentRepository: {
      getCommentsByThreadId: vi.fn().mockResolvedValue(mockComments),
    },
  });


  it('should return thread detail with mapped comments correctly', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const result = await useCase.execute('thread-123');

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');

    expect(result).toEqual({
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi thread',
      date: '2024-01-01T00:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2024-01-02T00:00:00.000Z',
          content: 'Komentar pertama',
        },
        {
          id: 'comment-456',
          username: 'janedoe',
          date: '2024-01-03T00:00:00.000Z',
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });

  it('should replace deleted comment content with placeholder text', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const result = await useCase.execute('thread-123');

    const deletedComment = result.comments.find((c) => c.id === 'comment-456');
    expect(deletedComment.content).toBe('**komentar telah dihapus**');

    const activeComment = result.comments.find((c) => c.id === 'comment-123');
    expect(activeComment.content).toBe('Komentar pertama');
  });

  it('should return empty comments array when thread has no comments', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();
    mockCommentRepository.getCommentsByThreadId.mockResolvedValue([]);

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const result = await useCase.execute('thread-123');

    expect(result.comments).toEqual([]);
  });


  it('should throw NotFoundError when threadId is not found', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    mockThreadRepository.getThreadById.mockRejectedValue(
      new NotFoundError('THREAD_NOT_FOUND'),
    );

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(useCase.execute('thread-tidak-ada')).rejects.toThrow(NotFoundError);


    expect(mockCommentRepository.getCommentsByThreadId).not.toHaveBeenCalled();
  });
});