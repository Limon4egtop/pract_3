const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
    fs.readFile('../admin-api/products.json', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => console.log(`Catalog Server running on http://localhost:${PORT}`));
