import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(checkToken);

const port = process.env.PORT ?? '8081';
const limit = { limit: '50mb' };
app.use(bodyParser.json(limit));

server.listen(port, () => {
	console.log(`✅ Server chạy trên cổng: ${port}`);
});

Routers.map((item) => {
	app.use(item.path, item.router);
});