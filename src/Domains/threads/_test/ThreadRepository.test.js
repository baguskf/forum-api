import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import pool from '../../../Infrastructures/database/postgres/pool.js';
import ThreadRepositoryPostgres from '../../../Infrastructures/repository/ThreadRepositoryPostgres.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should persist thread and return added thread correctly', async () => {
    const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

    const payload = {
      title: 'sebuah thread',
      body: 'isi thread',
      owner: 'user-123',
    };

    const addedThread = await threadRepository.addThread(payload);

    const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

    expect(threads).toHaveLength(1);
    expect(addedThread).toEqual({
      id: 'thread-123',
      title: payload.title,
      owner: payload.owner,
    });
  });
});