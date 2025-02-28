const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const productsFile = path.join(__dirname, 'products.json');

// 📌 Маршрут для отображения страницы админ-панели
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 📌 Получение списка товаров
app.get('/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });
        res.json(JSON.parse(data));
    });
});

// 📌 Добавление нового товара
app.post('/products', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });

        let products = JSON.parse(data);
        const newProduct = { id: products.length ? products[products.length - 1].id + 1 : 1, ...req.body };
        products.push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Ошибка записи' });
            res.status(201).json(newProduct);
        });
    });
});

// 📌 Удаление товара по ID
app.delete('/products/:id', (req, res) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });

        let products = JSON.parse(data);
        const productId = parseInt(req.params.id);
        products = products.filter(p => p.id !== productId);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Ошибка записи' });
            res.status(204).send();
        });
    });
});

// 📌 Запуск сервера
app.listen(PORT, () => console.log(`Admin API running on http://localhost:${PORT}`));
