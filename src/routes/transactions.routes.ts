import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import csvConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(csvConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find({
    relations: ['category'],
  });
  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  try {
    const { title, type, value, category } = request.body;
    const createTransaction = new CreateTransactionService();
    const transaction = await createTransaction.execute({
      title,
      type,
      value,
      category,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ status: 'error', message: err.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;
  try {
    const deleteTransaction = new DeleteTransactionService();
    await deleteTransaction.execute({ id });
    return response.status(204).send();
  } catch (err) {
    return response.status(400).json({ status: 'error', message: err.message });
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const { filename } = request.file;
    try {
      const importService = new ImportTransactionsService();
      const transactions = await importService.execute({ filename });

      return response.json(transactions);
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'error', message: err.message });
    }
  },
);

export default transactionsRouter;
