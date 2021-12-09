import app from './application';
import db from './db';

const port = process.env.PORT || 8000;

db.init();

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server started at http://localhost:${port}`);
});
