import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { getMessage } from './message-utils';
import usersRouter from './api/v1/users';
import favoriteUsersRouter from './api/v1/favorite-users';
import cors from 'cors';import bodyParser from 'body-parser';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send(getMessage());
});

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/favorite-users', favoriteUsersRouter);

app.listen(port, () => {
  console.log(`Server is running 🚀 at http://localhost:${port}\n'Cmd + click' the link above ☝️ to open it in the browser.`);
});