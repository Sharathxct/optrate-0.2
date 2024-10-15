import express from 'express';
import { router } from './routes/user';
const bodyParser = require('body-parser');

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.listen(3000, () => {
  console.log("App listening on port 3000")
});
