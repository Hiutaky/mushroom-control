// Type 3: Persistent datastore with automatic loading
import Datastore from 'nedb';

const db = new Datastore({ filename: 'data.db', autoload: true });
// You can issue commands right away




export default db