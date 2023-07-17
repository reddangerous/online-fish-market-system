  {/* Cart Modal */}
  <div className={`modal fade ${isCartModalOpen ? 'show' : ''}`} id="cartModal" tabIndex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="cartModalLabel">Cart</h5>
        <button type="button" className="btn-close" onClick={closeCartModal} aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <table className="table">
          <thead>
            <tr> 
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.fishId}>
                <td>{item.productDetails}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
        {cart.length > 0 && (
          <button
            type="button"
            className="btn btn-warning"
            onClick={handlePlaceOrder}
            data-bs-toggle="modal"
            data-bs-target="#cartModal"
          >
            Place Order
          </button>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeCartModal}>Close</button>
      </div>
    </div>
  </div>
</div>