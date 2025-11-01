document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('addToCart');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const productId = btn.dataset.productId || '';
    const inputEl = document.getElementById('_idCarrito');
    const defaultVal = inputEl ? inputEl.value.trim() : '';

    const cartId = prompt('Ingrese ID del carrito:', defaultVal);
    if (cartId === null) return;

    fetch(`/api/carts/${encodeURIComponent(cartId)}/products/${encodeURIComponent(productId)}`, {
      method: 'POST'
    })
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(data => alert('Producto agregado al carrito.'))
    .catch(err => alert('Error al agregar producto: ' + err.message));    
  });
});