// tests/CommentsTableTestHelper.js
// Helper ini digunakan oleh integration test untuk setup/teardown tabel comments.

import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'Sebuah komentar',
    threadId = 'thread-123',
    owner = 'user-123',
    isDelete = false,
  } = {}) {
    await pool.query({
      text: `
        INSERT INTO comments (id, content, thread_id, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, NOW(), $5)
      `,
      values: [id, content, threadId, owner, isDelete],
    });
  },

  async findCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    });
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

export default CommentsTableTestHelper;