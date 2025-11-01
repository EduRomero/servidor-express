const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const list = document.getElementById('product-list');
  const form = document.getElementById('add-product-form');

  function createListItem(p) {
    const id = p._id || p.id || p._id?.toString();
    const li = document.createElement('li');
    li.dataset.id = id;
    li.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <p>Precio: $${escapeHtml(p.price)}</p>
      <p>Descripción: ${escapeHtml(p.description)}</p>
      <a href="#" class="btn btn-danger delete-product" data-id="${id}">Eliminar</a>
    `;
    return li;
  }

  function renderProducts(products) {
    list.innerHTML = '';
    products.forEach(p => list.appendChild(createListItem(p)));
  }

  function appendProduct(p) {
    list.appendChild(createListItem(p));
  }

  function removeProductById(id) {
    const item = list.querySelector(`li[data-id="${id}"]`);
    if (item) item.remove();
  }

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  socket.on('nuevoProducto', (productOrList) => {
    if (Array.isArray(productOrList)) renderProducts(productOrList);
    else appendProduct(productOrList);
  });

  socket.on('eliminarProducto', (id) => {
    removeProductById(id);
  });

  list.addEventListener('click', async (e) => {
    const del = e.target.closest('.delete-product');
    if (!del) return;
    e.preventDefault();
    const id = del.dataset.id;
    if (!id) return alert('ID no encontrado');

    if (!confirm('¿Eliminar producto?')) return;

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message: res.statusText}));
        return alert('Error: ' + (err.message || res.statusText));
      }
      removeProductById(id);
    } catch (err) {
      console.error(err);
      alert('Error al eliminar producto');
    }
  });

  // Enviar nuevo producto por POST al API
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('id').value.trim();
    const title = document.getElementById('title').value.trim();
    const price = Number(document.getElementById('price').value);
    const description = document.getElementById('description').value.trim();
    const code = document.getElementById('code').value.trim();
    const stock = Number(document.getElementById('stock').value);
    const category = document.getElementById('category').value.trim();

    if (!title || !description || !price) return alert('Complete todos los campos');

    const payload = { id, title, price, description, code, stock, category };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message: res.statusText}));
        return alert('Error: ' + (err.message || res.statusText));
      }
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Error al agregar producto');
    }
  });
});