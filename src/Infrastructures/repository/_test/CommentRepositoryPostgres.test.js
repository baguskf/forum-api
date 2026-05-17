import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('addComment', () => {
    it('should persist comment and return added comment correctly', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      const result = await commentRepository.addComment({
        content: 'Sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      expect(result).toHaveProperty('id', 'comment-123');
      expect(result).toHaveProperty('content', 'Sebuah komentar');
      expect(result).toHaveProperty('owner', 'user-123');
    });
  });


  describe('checkCommentAvailability', () => {
    it('should not throw error when comment exists and is not deleted', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        isDelete: false,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await expect(
        commentRepository.checkCommentAvailability('comment-123'),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await expect(
        commentRepository.checkCommentAvailability('comment-tidak-ada'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when comment is already soft deleted', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        isDelete: true,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await expect(
        commentRepository.checkCommentAvailability('comment-123'),
      ).rejects.toThrow(NotFoundError);
    });
  });


  describe('verifyCommentOwner', () => {
    it('should not throw error when owner is valid', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await expect(
        commentRepository.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await expect(
        commentRepository.verifyCommentOwner('comment-tidak-ada', 'user-123'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when user is not the comment owner', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await expect(
        commentRepository.verifyCommentOwner('comment-123', 'user-lain'),
      ).rejects.toThrow(AuthorizationError);
    });
  });


  describe('softDeleteComment', () => {
    it('should mark comment as deleted in the database', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        isDelete: false,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      await commentRepository.softDeleteComment('comment-123');

      const deletedComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(deletedComment.is_delete).toBe(true);
    });
  });


  describe('getCommentsByThreadId', () => {
    it('should return comments for a given thread ordered by date ascending', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'Komentar pertama',
        threadId: 'thread-123',
        owner: 'user-123',
        isDelete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'Komentar kedua',
        threadId: 'thread-123',
        owner: 'user-123',
        isDelete: true,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      const comments = await commentRepository.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(2);

      expect(comments[0]).toHaveProperty('id', 'comment-123');
      expect(comments[0]).toHaveProperty('content', 'Komentar pertama');
      expect(comments[0]).toHaveProperty('username', 'dicoding');
      expect(comments[0]).toHaveProperty('is_delete', false);

      expect(comments[1]).toHaveProperty('id', 'comment-456');
      expect(comments[1]).toHaveProperty('is_delete', true);
    });

    it('should return empty array when thread has no comments', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      const comments = await commentRepository.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(0);
    });
  });
});