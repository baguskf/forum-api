import { describe, it, expect, vi } from 'vitest';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteCommentUseCase', () => {

  const makeMocks = () => ({
    mockThreadRepository: {
      verifyThreadExists: vi.fn().mockResolvedValue(undefined),
    },
    mockCommentRepository: {
      checkCommentAvailability: vi.fn().mockResolvedValue(undefined),
      verifyCommentOwner: vi.fn().mockResolvedValue(undefined),
      softDeleteComment: vi.fn().mockResolvedValue(undefined),
    },
  });

  const useCasePayload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };


  it('should orchestrate delete comment correctly on success', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await useCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith('thread-123');

    expect(mockCommentRepository.checkCommentAvailability)
      .toHaveBeenCalledWith('comment-123');

    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith('comment-123', 'user-123');

    expect(mockCommentRepository.softDeleteComment)
      .toHaveBeenCalledWith('comment-123');
  });


  it('should call repository methods in the correct order', async () => {
    const callOrder = [];
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    mockThreadRepository.verifyThreadExists.mockImplementation(async () => {
      callOrder.push('verifyThreadExists');
    });
    mockCommentRepository.checkCommentAvailability.mockImplementation(async () => {
      callOrder.push('checkCommentAvailability');
    });
    mockCommentRepository.verifyCommentOwner.mockImplementation(async () => {
      callOrder.push('verifyCommentOwner');
    });
    mockCommentRepository.softDeleteComment.mockImplementation(async () => {
      callOrder.push('softDeleteComment');
    });

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await useCase.execute(useCasePayload);

    expect(callOrder).toEqual([
      'verifyThreadExists',
      'checkCommentAvailability',
      'verifyCommentOwner',
      'softDeleteComment',
    ]);
  });


  it('should throw NotFoundError when threadId is not found', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    mockThreadRepository.verifyThreadExists.mockRejectedValue(
      new NotFoundError('thread tidak ditemukan'),
    );

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);


    expect(mockCommentRepository.checkCommentAvailability).not.toHaveBeenCalled();
    expect(mockCommentRepository.verifyCommentOwner).not.toHaveBeenCalled();
    expect(mockCommentRepository.softDeleteComment).not.toHaveBeenCalled();
  });


  it('should throw NotFoundError when commentId is not found', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    mockCommentRepository.checkCommentAvailability.mockRejectedValue(
      new NotFoundError('COMMENT_NOT_FOUND'),
    );

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');

    expect(mockCommentRepository.verifyCommentOwner).not.toHaveBeenCalled();
    expect(mockCommentRepository.softDeleteComment).not.toHaveBeenCalled();
  });


  it('should throw AuthorizationError when user is not the comment owner', async () => {
    const { mockThreadRepository, mockCommentRepository } = makeMocks();

    mockCommentRepository.verifyCommentOwner.mockRejectedValue(
      new AuthorizationError('anda bukan pemilik komentar'),
    );

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(useCase.execute(useCasePayload)).rejects.toThrow(AuthorizationError);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith('comment-123');

    expect(mockCommentRepository.softDeleteComment).not.toHaveBeenCalled();
  });
});