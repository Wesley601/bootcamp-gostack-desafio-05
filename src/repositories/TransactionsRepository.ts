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
    const income = await this.getIncome();
    const outcome = await this.getOutcome();
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public async getIncome(): Promise<number> {
    const { sum } = await this.createQueryBuilder('transactions')
      .where('type = :income', { income: 'income' })
      .select('SUM(transactions.value)')
      .getRawOne();
    return sum || 0;
  }

  public async getOutcome(): Promise<number> {
    const { sum } = await this.createQueryBuilder('transactions')
      .where('type = :outcome', { outcome: 'outcome' })
      .select('SUM(transactions.value)')
      .getRawOne();
    return sum || 0;
  }
}

export default TransactionsRepository;
