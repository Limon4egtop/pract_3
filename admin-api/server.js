const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const productsFile = './products.json';

// Swagger документация
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Admin Panel API',
            version: '1.0.0',
            description: 'API для управления товарами',
        },
        servers: [{ url: 'http://localhost:8080' }],
    },
    apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список товаров
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get('/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });
        res.json(JSON.parse(data));
    });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Добавить новый товар
 */
app.post('/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });

        const products = JSON.parse(data);
        const newProduct = { id: products.length + 1, ...req.body };
        products.push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Ошибка записи' });
            res.status(201).json(newProduct);
        });
    });
});

app.listen(PORT, () => console.log(`Admin API running on http://localhost:${PORT}`));
