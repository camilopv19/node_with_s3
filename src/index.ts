import express from 'express';
import cors from 'cors';
import router from "./routes";
import * as path from 'path';

const app = express();
app.use(express.static('public'));
app.use(express.static('src/scripts'));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.disable('x-powered-by');
app.use('/', router);

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT;

app.listen(PORT || 1337, () => console.log(`main-server listening on port: ${PORT}`));