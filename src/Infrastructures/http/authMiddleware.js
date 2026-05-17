import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'fail',
      message: 'Missing authentication',
    });
  }

  try {
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.auth = {
      credentials: {
        id: decoded.id,
      },
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
};

export default authMiddleware;