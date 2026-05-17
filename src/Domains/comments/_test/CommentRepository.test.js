import { describe, it, expect } from 'vitest';
import CommentRepository from '../CommentRepository.js';

describe('CommentRepository interface', () => {
  it('should throw error when invoking unimplemented method', async () => {
    const repo = new CommentRepository();

    await expect(repo.addComment({}))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});