import { describe, it, expect } from 'vitest';
import AddedComment from '../AddedComment.js';

describe('AddedComment entity', () => {
  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});