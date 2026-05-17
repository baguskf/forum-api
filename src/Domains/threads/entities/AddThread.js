import InvariantError from '../../../Commons/exceptions/InvariantError.js';

class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verifyPayload(payload) {
    const { title, body } = payload;

    if (!title || !body) {
      throw new InvariantError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new InvariantError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddThread;