import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

class CommentsHandler {


  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const useCase = this._container.getInstance(AddCommentUseCase.name);

      const { id: owner } = req.auth.credentials;
      const { threadId } = req.params;
      const { content } = req.body;

      const addedComment = await useCase.execute({
        content,
        threadId,
        owner,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {

      console.log('DELETE HIT');
      console.log(req.params);
      console.log(req.auth.credentials);
      const useCase = this._container.getInstance(DeleteCommentUseCase.name);

      console.log('USECASE:', useCase);

      const { id: owner } = req.auth.credentials;
      const { threadId, commentId } = req.params;

      await useCase.execute({
        threadId,
        commentId,
        owner,
      });

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;