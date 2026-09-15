import express from 'express';
import { energyQueryTool } from './tools/energyQuery.js';

const app = express();
app.use(express.json()); // JSON-RPC изисква JSON тяло

const PORT = 8080;
const ALLOWED_ORIGIN = 'localhost'; // Промяна при нужда

// 1. Сигурност: Валидация на Origin хедъра срещу DNS rebinding
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && !origin.includes(ALLOWED_ORIGIN)) {
        return res.status(403).json({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Forbidden: Invalid Origin" }
        });
    }
    next();
});

// 2. Универсален MCP Endpoint (Поддържа POST и GET)
app.all('/mcp', (req, res) => {
    // Всички съобщения от клиента пристигат като POST
    if (req.method === 'POST') {
        const message = req.body;

        // Проверка дали съобщението е респонс или нотификация
        if (!message.id) {
            // Приемане без връщане на тяло (Status 202)
            return res.status(202).end();
        }

        // Ако е заявка (Request), клиентът трябва да поддържа и text/event-stream
        const acceptHeader = req.headers.accept || '';
        
        if (acceptHeader.includes('text/event-stream')) {
            // Иницииране на SSE Стрийм за асинхронен отговор
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            // Изпращане на празно начално събитие за подкана за реконект
            res.write(`id: stream-init-123\ndata: \n\n`);

            // Примерно съобщение с данни за енергията (JSON-RPC отговор)
            const responseMessage = {
                jsonrpc: "2.0",
                id: message.id,
                result: { energySavedKW: "1.4", mode: "Eco-Cinema" }
            };

            setTimeout(() => {
                res.write(`data: ${JSON.stringify(responseMessage)}\n\n`);
                res.end(); // Терминиране на стрийма след изпращане на отговора
            }, 1000);

        } else {
            // Стандартен синхронен JSON отговор
            return res.json({
                jsonrpc: "2.0",
                id: message.id,
                result: { status: "success" }
            });
        }
    } 
    // Заявки тип GET се използват за отваряне на чист слушащ стрийм от клиента
    else if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(`data: {"jsonrpc":"2.0","method":"notifications/initialized"}\n\n`);
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

// Вътре във вашия app.post('/mcp', ...) хендлър:
if (message.method === 'tools/call') {
    if (message.params.name === 'query_home_energy') {
        const result = await energyQueryTool.handler(message.params.arguments);
        
        return res.json({
            jsonrpc: "2.0",
            id: message.id,
            result: result
        });
    }
}

// Свързване само към localhost от съображения за сигурност
app.listen(PORT, '127.0.0.1', () => {
    console.log(`EcoSync MCP Server running at http://localhost:${PORT}/mcp`);
});
