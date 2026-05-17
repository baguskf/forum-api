import { describe, it, expect } from 'vitest';
import AddComment from '../AddComment.js';

describe('AddComment entity', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new AddComment({
      content: 'comment',

    })).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type not match', () => {
    expect(() => new AddComment({
      content: 123,
      threadId: 'thread-123',
      owner: 'user-123',
    })).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const addComment = new AddComment(payload);

    expect(addComment.content).toEqual(payload.content);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.owner).toEqual(payload.owner);
  });
});