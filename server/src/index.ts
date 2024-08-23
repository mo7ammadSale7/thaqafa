import app from './app';
import { indexRoute } from './routes';
import { ConsoleMsg as msg } from './helper/chalk';


const PORT = process.env.PORT || '3000';
app.use('/api', indexRoute);


app.listen(PORT, () => {
  msg.success('Express server listening on port ' + PORT);
});
