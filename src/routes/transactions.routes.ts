import { Router } from 'express';
import multer from 'multer';

import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);
transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionsService = new CreateTransactionService();
  return response.json(await createTransactionsService.execute(request.body));
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionsService = new DeleteTransactionService();
  const { id } = request.params;
  await deleteTransactionsService.execute({ id });
  return response.json({ message: 'deleted' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const filePath = request.file.path;
    return response.json(await importTransactionsService.execute({ filePath }));
  },
);

export default transactionsRouter;
