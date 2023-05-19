import express from 'express';
import cors from 'cors';
import router from "./routes";

const app = express();
app.use(express.static('public'));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.disable('x-powered-by');
app.use('/', router);



const PORT = process.env.PORT;

app.listen(PORT || 1337, () => console.log(`main-server listening on port: ${PORT}`));