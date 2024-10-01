import { getAuth } from 'firebase/auth';
import configApp from './config';

export class AuthFirebase {
  auth = getAuth(configApp);
}
