import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const { income } = await this.createQueryBuilder('transactions')
      .select('SUM(transactions.value)', 'income')
      .where("transactions.type = 'income'")
      .getRawOne();

    const { outcome } = await this.createQueryBuilder('transactions')
      .select('SUM(transactions.value)', 'outcome')
      .where("transactions.type = 'outcome'")
      .getRawOne();

    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
