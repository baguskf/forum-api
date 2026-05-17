import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {

    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('addThread', () => {
    it('should persist thread and return added thread correctly', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      const result = await threadRepository.addThread({
        title: 'Judul Thread',
        body: 'Isi thread',
        owner: 'user-123',
      });

      expect(result).toHaveProperty('id', 'thread-123');
      expect(result).toHaveProperty('title', 'Judul Thread');
      expect(result).toHaveProperty('owner', 'user-123');
    });
  });


  describe('verifyThreadExists', () => {
    it('should not throw error when thread exists', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      await expect(
        threadRepository.verifyThreadExists('thread-123'),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      await expect(
        threadRepository.verifyThreadExists('thread-tidak-ada'),
      ).rejects.toThrow(NotFoundError);
    });
  });


  describe('getThreadById', () => {
    it('should return thread detail correctly when thread exists', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Judul Thread',
        body: 'Isi thread',
        owner: 'user-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      const thread = await threadRepository.getThreadById('thread-123');

      expect(thread).toHaveProperty('id', 'thread-123');
      expect(thread).toHaveProperty('title', 'Judul Thread');
      expect(thread).toHaveProperty('body', 'Isi thread');
      expect(thread).toHaveProperty('username', 'dicoding');
      expect(thread).toHaveProperty('created_at');
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      await expect(
        threadRepository.getThreadById('thread-tidak-ada'),
      ).rejects.toThrow(NotFoundError);
    });
  });
});