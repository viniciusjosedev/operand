import { getDatabase } from 'firebase/database';
import configApp from './config';

export class DatabaseFirebase {
  database = getDatabase(configApp);
}
