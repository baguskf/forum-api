import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'isi thread',
    owner = 'user-123',
  } = {}) {
    await pool.query({
      text: `
        INSERT INTO threads(id, title, body, owner)
        VALUES ($1, $2, $3, $4)
      `,
      values: [id, title, body, owner],
    });
  },

  async findThreadById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    });

    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads RESTART IDENTITY CASCADE');
  },
};

export default ThreadsTableTestHelper;