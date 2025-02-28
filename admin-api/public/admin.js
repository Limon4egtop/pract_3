document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const productsContainer = document.getElementById("products");

    // Функция загрузки товаров
    function loadProducts() {
        fetch("/products")
            .then(response => response.json())
            .then(products => {
                productsContainer.innerHTML = "";
                products.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");
                    productCard.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <strong>${product.price} руб.</strong>
                        <p><em>Категории: ${product.categories.join(", ")}</em></p>
                        <button onclick="deleteProduct(${product.id})">Удалить</button>
                    `;
                    productsContainer.appendChild(productCard);
                });
            })
            .catch(error => console.error("Ошибка загрузки:", error));
    }

    // Функция удаления товара
    window.deleteProduct = function (id) {
        fetch(`/products/${id}`, { method: "DELETE" })
            .then(() => {
                loadProducts();
            })
            .catch(error => console.error("Ошибка удаления:", error));
    };

    // Обработчик формы добавления товара
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const categories = document.getElementById("categories").value.split(",").map(c => c.trim());

        const newProduct = { name, description, price: Number(price), categories };

        fetch("/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        })
            .then(response => response.json())
            .then(() => {
                form.reset();
                loadProducts(); // Обновляем список товаров после добавления
            })
            .catch(error => console.error("Ошибка добавления:", error));
    });

    // Загрузка товаров при открытии страницы
    loadProducts();
});
