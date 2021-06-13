import 'dotenv/config';

import './db';
import './models/User';
import './models/Comment';
import './models/News';

import app from './server';

const PORT = 4000;

const handleListening = () => {
    console.log(`Listening on PORT:${PORT}`);
}

app.listen(4000, handleListening);
