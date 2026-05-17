import AddThread from '../../Domains/threads/entities/AddThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload, owner) {
    const addThread = new AddThread(payload);


    const addedThread = await this._threadRepository.addThread({
      title: addThread.title,
      body: addThread.body,
      owner,
    });

    return addedThread;
  }
}

export default AddThreadUseCase;