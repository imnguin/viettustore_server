import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { SerialPort } from 'serialport';
import { WebSocketServer } from 'ws'; // Sửa import
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const port = process.env.PORT || 8081;

// Tự động tìm cổng COM
async function findComPort() {
	const ports = await SerialPort.list();
	const scalePort = ports.find((p) => p.manufacturer?.includes('Your_Scale_Manufacturer')); // Thay bằng tên nhà sản xuất
	return scalePort ? scalePort.path : 'COM1';
}

(async () => {
	const comPath = await findComPort();
	const portCom = new SerialPort({
		path: comPath,
		baudRate: 9600,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
	});

	// Xử lý lỗi cổng
	portCom.on('error', (err) => {
		console.error('Lỗi cổng COM:', err.message);
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ error: 'Cổng COM không hoạt động' }));
			}
		});
	});

	// Khởi tạo WebSocket server
	const wss = new WebSocketServer({ server }); // Sửa WebSocket.Server thành WebSocketServer

	wss.on('connection', (ws) => {
		console.log('Client đã kết nối qua WebSocket');
		ws.on('message', (message) => {
			console.log('Nhận:', message.toString());
		});
		ws.on('error', (err) => {
			console.error('Lỗi WebSocket:', err.message);
		});
	});

	// Xử lý dữ liệu từ cân
	let buffer = '';
	portCom.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split(/[\r\n]+/);
		if (lines.length > 1) {
			const weightData = lines[0].trim();
			buffer = lines.slice(1).join('');
			const weightValue = parseFloat(weightData.replace(/[^0-9.]/g, '')) || 0;
			console.log('Khối lượng:', weightValue);
			wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ weight: weightValue }));
				}
			});
		}
	});

	// API trạng thái cổng
	app.get('/statusCom', (req, res) => {
		res.json({ portOpen: portCom.isOpen });
	});

	// Tải các route
	Routers.map((item) => {
		app.use(item.path, item.middleware ? [checkToken, item.router] : item.router);
	});

	server.listen(port, () => {
		console.log(`✅ Server chạy trên cổng: ${port}`);
	});
})();