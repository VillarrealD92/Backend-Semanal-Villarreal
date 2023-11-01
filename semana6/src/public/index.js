document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const productList = document.getElementById('product-list');

    socket.on('productos', (productos) => {
        productList.innerHTML = ''; // Borrar la lista actual

        productos.forEach((producto) => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${producto.id}, Título: ${producto.title}, Precio: ${producto.price}`;
            productList.appendChild(listItem);
        });
    });
});