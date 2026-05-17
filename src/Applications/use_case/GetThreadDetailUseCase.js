class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      username: thread.username,
      comments: this._mapComments(comments),
    };
  }

  _mapComments(comments) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content,
    }));
  }
}

export default GetThreadDetailUseCase;