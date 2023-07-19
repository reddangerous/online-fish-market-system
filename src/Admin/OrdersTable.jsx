

const OrdersTable = ({ orders }) => {

  return (
    <div className="container mt-4">
      {orders.length > 0 ? (
        <table className="table">
          <thead>
            {/* Table headers */}
            <tr>
              <th>Order Id</th>
              <th>Fish Name</th>
              <th>Fish Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item.id}>
                <td>{item.orderId}</td>
                <td>{item.fishName}</td>
                <td>${item.fishPrice}</td>
                <td>{item.quantity}</td>
                <td>${item.total}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrdersTable;
