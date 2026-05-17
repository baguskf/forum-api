import express from 'express';
import authMiddleware from '../../../../Infrastructures/http/authMiddleware.js';

const createCommentsRouter = (handler) => {
  const router = express.Router();

  router.post('/:threadId/comments', authMiddleware, handler.postCommentHandler);

  router.delete(
    '/:threadId/comments/:commentId',
    authMiddleware,
    handler.deleteCommentHandler
  );

  return router;
};

export default createCommentsRouter;