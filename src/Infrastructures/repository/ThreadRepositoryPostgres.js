import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
    INSERT INTO threads(id, title, body, owner, created_at)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id, title, owner
  `,
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {

      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `
      SELECT 
        threads.id,
        threads.title,
        threads.body,
        threads.created_at,
        users.username
      FROM threads
      JOIN users ON users.id = threads.owner
      WHERE threads.id = $1
    `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('THREAD_NOT_FOUND');
    }

    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;