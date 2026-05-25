import AddComment from '../../Domains/comments/entities/AddComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {


    const addComment = new AddComment(useCasePayload);

    await this._threadRepository.verifyThreadExists(addComment.threadId);

    const addedComment = await this._commentRepository.addComment({
      content: addComment.content,
      threadId: addComment.threadId,
      owner: addComment.owner,
    });

    return addedComment;
  }
}

export default AddCommentUseCase;