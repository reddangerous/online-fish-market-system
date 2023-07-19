import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabase'; // Replace with your Supabase client import

const SellerOrders = () => {
  const { orderId } = useParams();
  const{sellerId} = useParams();
  const [order, setOrder] = useState([]);
  const [isApprovedMap, setIsApprovedMap] = useState([]); // State to track approved status for each order item

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      // Fetch order details from the order table using the orderId and sellerId
      const { data, error } = await supabase
        .from('order')
        .select('*')
        .eq('sellerId', sellerId);
  
      if (error) {
        console.error('Error fetching order details:', error);
      } else {
        setOrder(data);
        const approvalMap = {}; // Create a map to store approved status for each order item
        data.forEach((item) => {
          approvalMap[item.id] = item.approved;
        });
        setIsApprovedMap(approvalMap);
      }
    } catch (error) {
      console.error('Error fetching order details:', error.message);
    }
  };
  

  const handleApproveOrder = async (itemId) => {
    try {
      // Update the order item's approved status in the order table
      const { data, error } = await supabase
        .from('order')
        .update({ Approved: true })
        .eq('orderId', itemId);

      if (error) {
        console.error('Error updating order status:', error);
      } else {
        console.log('Order approved:', data);
        setIsApprovedMap((prevState) => ({
          ...prevState,
          [itemId]: true, // Update the approved status in the state
        }));
      }
    } catch (error) {
      console.error('Error updating order status:', error.message);
    }
  };

  return (
    <div className="container mt-4">
      {order.length > 0 ? (
        <table className="table">
          <thead>
            {/* Table headers */}
            <tr>
              <th>Fish Name</th>
              <th>Fish Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {order.map((item) => (
              <tr key={item.orderId}>
                <td>{item.fishName}</td>
                <td>${item.fishPrice}</td>
                <td>{item.quantity}</td>
                <td>${item.total}</td>
                <td>
                  {isApprovedMap[item.id] ? (
                    <p className="text-success">Complete</p>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleApproveOrder(item.id)}>
                      Approve
                    </button>
                  )}
                </td>
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

export default SellerOrders;
