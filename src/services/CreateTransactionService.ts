import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  type: 'income' | 'outcome';
  value: number;
  title: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    type,
    category,
    title,
    value,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (total < value) {
        throw new AppError('outcome greater than total');
      }
    }

    let categoryEntity = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryEntity);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: categoryEntity,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
