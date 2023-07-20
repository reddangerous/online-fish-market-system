import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import supabase from '../supabase';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';



const FishList = () => {
  const [fishList, setFishList] = useState([]);
  const [cart, setCart] = useState([]);
  const [time, setTime] = useState('');
  const [user, setUser] = useState([]);
  const [fishListWithLocation, setFishListWithLocation] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchFishData();
    fetchTime();
    fetchUser();
    loadCartFromLocalStorage();
    fetchOrders();
  }, []);

  useEffect(() => {
    saveCartToLocalStorage();
  }, [cart]);
  useEffect(() => {
    fetchLocation(); 
    // Call fetchLocation when fishList is updated
  }, [fishList]);
  
  const fetchUser = async () => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id);

    if (error) {
      console.error('Error fetching seller data:', error);
    } else {
      setUser(data);
    }
  };

  const fetchLocation = async () => {
    try {
      // Fetch location data from users table
      const { data: locationData, error } = await supabase.from('users').select('id, location, phone');
      if (error) {
        console.error('Error fetching location data:', error);
      } else {
        // Create a map of UserId to location for quick access
        const locationMap = {};
        const phoneMap = {};
        locationData.forEach((location) => {
          locationMap[location.id] = location.location;
        });
        locationData.forEach((phone) => {
          phoneMap[phone.id] = phone.phone;
        });
        // Add location data to each fish object
        const fishDataWithLocation = fishList.map((fish) => ({
          ...fish,
          location: locationMap[fish.UserId] || '',
          phone: phoneMap[fish.UserId] || '',
        }));

        setFishListWithLocation(fishDataWithLocation);
      }
    } catch (error) {
      console.error('Error fetching location data:', error.message);
    }
  };
    
  
   
  const fetchFishData = async () => {
    try {
      // Fetch fish data from Supabase
      const { data: fishData, error } = await supabase
        .from('fish')
        .select('*, UserId') // Make sure to select the UserId for join
        .order('UserId', { ascending: false });

      if (error) {
        console.error('Error fetching fish data:', error);
      } else {
        setFishList(fishData);
        
      }
    } catch (error) {
      console.error('Error fetching fish data:', error.message);
    }
  };

  const fetchTime = () => {
    // Get the current time
    const now = new Date();
    const hour = now.getHours();

    // Set the time variable
    setTime(`Good ${hour >= 12 ? 'afternoon' : hour < 6 ? 'morning' : 'evening'}`);
  };

  const handleAddToCart = (fishId) => {
    // Check if the fish is already in the cart
    const fish = fishList.find((f) => f.id === fishId);
    const cartItem = cart.find((item) => item.id === fishId);
  
    if (cartItem) {
      // Increase the quantity of the fish in the cart
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === fishId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Add the fish to the cart with quantity = 1
      setCart([...cart, { ...fish, quantity: 1 }]);
    }
  };
  
  const handleRemoveFromCart = (fishId) => {
    // Decrease the quantity of the fish in the cart or remove it if quantity is 1
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === fishId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
      )
    );
  };

  const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Generate a unique orderId using UUID
      const orderId = uuidv4();
  
      // Prepare the order data to be inserted into the order table
      const orderData = cart.map((fish) => ({
        orderId: orderId, // Associate all items with the same orderId
        fishName: fish.productDetails,
        fishPrice: fish.price,
        quantity: fish.quantity,
        total: fish.price * fish.quantity,
        sellerId: fish.UserId, // Store the sellerId as a single value, not an array
      }));
  
      // Insert the order data into the order table
      const { data: orderDataResponse, error: orderError } = await supabase.from('order').insert(orderData);
      if (orderError) {
        console.error('Error inserting order data:', orderError);
      } else {
        console.log('Order data inserted:', orderDataResponse);
        // Clear the cart after placing the order
        setCart([]);
  
        // Create a single order entry in the user_orders table with the sellerId as an array
        const orderEntry = {
          userId: id,
          orderId: orderId,
          orderDate: new Date().toISOString(), // Add the order date if needed
          // Add any other relevant columns for user_orders table
        };
  
        const { data: userOrderData, error: userOrderError } = await supabase.from('user_orders').insert([orderEntry]);
        if (userOrderError) {
          console.error('Error inserting user_orders data:', userOrderError);
        } else {
          console.log('User_orders data inserted:', userOrderData);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };


  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSavePhoneNumber = async () => {
    try {
      // Update the user's phone number in the users table
      const { data, error } = await supabase
        .from('users')
        .update({ phone: phoneNumber })
        .eq('id', id);
      if (error) {
        console.error('Error updating phone number:', error);
      } else {
        console.log('Phone number updated:', data);
        // Show a success message to the user (optional)
        alert('Phone number updated successfully!');
      }
    } catch (error) {
      console.error('Error updating phone number:', error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      // Fetch order data from Supabase
      const { data: orderData, error } = await supabase
        .from('user_orders')
        .select('*')
        .eq('userId', id);

      if (error) {
        console.error('Error fetching order data:', error);
      } else {
        setOrders(orderData);
      }
    } catch (error) {
      console.error('Error fetching order data:', error.message);
    }
  };

  const handleViewOrderDetails = (orderId) => {
    // Redirect to OrderDetails component with orderId as a URL parameter
    navigate(`/order-details/${orderId}`);
  };

  
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6">
          {user.map((user) => (
            <h2 className="text-center mb-4" key={user.id}>
              {time} <br></br>{user.firstName}
            </h2>
          ))}
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {fishListWithLocation.map((fish) => (
              <div key={fish.id} className="col mb-4">
                <div className="card">
                  <img src={fish.fishImage} className="card-img-top" alt={fish.productDetails} />
                  <div className="card-body">
                    <h5 className="card-title">{fish.productDetails}</h5>
                    <p className="card-text">Price: KSH {fish.price}</p>
                    <p className="card-text">Location: {fish.location}</p>
                    <p className="card-text">
          Seller phone: <a href={`tel:${fish.phone}`}>{fish.phone}</a>
        </p>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-orange me-2" onClick={() => handleAddToCart(fish.id)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                      <span className="fw-bold">
                        {cart.find((item) => item.id === fish.id)?.quantity || 0}
                      </span>
                      <button
                        className="btn btn-orange ms-2"
                        onClick={() => handleRemoveFromCart(fish.id)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="position-fixed top-0 end-0 p-2 bg-primary rounded-circle text-white">
            <button type="button" className="btn btn-primary" >
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cart.length > 0 && <span className="badge bg-danger">{cart.length}</span>}
            </button>
          </div>
          <div className="mb-4">
            <h4>User Profile</h4>
            {user.map((user) => (
            <>
            <p>Email: {user.email}</p>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Location: {user.location}</p>
            </>
            ))}
          </div>
          <div>
            <h4>Cart Details</h4>
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
                    <td>KSH{item.price}</td>
                    <td>KSH{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
            {cart.length > 0 && (
             
          <>
            <div className="mb-3">
        <label htmlFor="phoneNumber" className="form-label">
          Phone Number
        </label>
        <input
          type="tel"
          className="form-control"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSavePhoneNumber}>
        Save Phone Number
      </button>
      <button type="button" className="btn btn-warning" onClick={handlePlaceOrder}>
        Place Order
      </button>
      </>
            )}
    </div>
    
   {/* Table to display orders */}
   <div className="mt-4">
      <h2>Orders Placed</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderId}</td>
              <td>{order.orderDate}</td>
              <td>
                
                  <button
                    className="btn btn-success"
                    onClick={() => handleViewOrderDetails(order.orderId)}
                  >
                    View
                  </button>
                
              </td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </div>
        </div>
      </div>
    

  );
};

export default FishList;

