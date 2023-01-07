import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('Running!'));

let port = 4000;
app.listen(port, async () => {
  console.log(`running at http://localhost:${port}`);

  // once in your application bootstrap
  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
      console.log('database initialized');
    })
    .catch((error) => console.log(error));
});
