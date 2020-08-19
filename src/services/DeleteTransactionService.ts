import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!transaction) {
      // Send Error
      throw new AppError('Transaction not exists');
    }
    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
