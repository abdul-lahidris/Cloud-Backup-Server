require('dotenv').config();
import 'reflect-metadata';
import config from 'config';
import { AppDataSource } from './utils/data-source';
import app from './app';

AppDataSource.initialize()
  .then(async () => {

    const port = config.get<number>('port');
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
