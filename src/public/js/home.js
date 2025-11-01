document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const productId = btn.dataset.productId;
      const cartId = prompt('Ingrese ID del carrito:');
      if (!cartId) return; // canceló o vacío

      try {
        const url = `/api/carts/${encodeURIComponent(cartId)}/products/${encodeURIComponent(productId)}`;
        const res = await fetch(url, { method: 'POST' });
        if (res.ok) {
          alert('Producto agregado al carrito.');
        } else {
          const data = await res.json().catch(() => ({}));
          alert('Error: ' + (data.error || res.statusText));
        }
      } catch (err) {
        console.error(err);
        alert('Error de conexión.');
      }
    });
  });
});