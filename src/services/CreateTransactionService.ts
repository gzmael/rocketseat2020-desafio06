import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    // verifica se a transação passa do total
    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Value is not valid');
    }

    const hasCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    const newCat =
      hasCategory ||
      categoryRepository.create({
        title: category,
      });

    await categoryRepository.save(newCat);

    const transaction = transactionRepository.create({
      title,
      type,
      value,
    });

    transaction.category = newCat;
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
