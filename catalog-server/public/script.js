document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('products');
            products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <strong>${product.price} руб.</strong>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Ошибка загрузки:', error));
});
