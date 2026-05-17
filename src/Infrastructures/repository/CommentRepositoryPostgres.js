import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ content, threadId, owner }) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO comments (id, content, thread_id, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, NOW(), false)
        RETURNING id, content, owner
      `,
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }


  async checkCommentAvailability(commentId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND is_delete = false',
      values: [commentId],
    });

    if (result.rows.length === 0) {
      throw new NotFoundError('COMMENT_NOT_FOUND');
    }
  }
  async verifyCommentOwner(commentId, owner) {
    const result = await this._pool.query({
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (result.rows.length === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const { owner: commentOwner } = result.rows[0];

    if (commentOwner !== owner) {
      throw new AuthorizationError('anda bukan pemilik komentar');
    }
  }

  async softDeleteComment(commentId) {
    await this._pool.query({
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
      SELECT 
        comments.id,
        comments.content,
        comments.date,
        comments.is_delete,
        users.username
      FROM comments
      JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC
    `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

export default CommentRepositoryPostgres;