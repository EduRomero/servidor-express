const socket = io();

socket.on('nuevoProducto', (product) => {
    const list = document.getElementById('product-list');
    const item = document.createElement('li');
    item.dataset.id = product.id;
    item.innerHTML = `
        <h3>${product.title}</h3>
        <p>Precio: $${product.price}</p>
        <p>Descripción: ${product.description}</p>
    `;
    list.appendChild(item);
});

socket.on('eliminarProducto', (id) => {
    const list = document.getElementById('product-list');
    const items = list.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        if (items[i].dataset.id == id) {
            list.removeChild(items[i]);
            break;
        }
    }
});