import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import supabase from '../supabase';
import {useNavigate} from 'react-router-dom';

const SellerProfile = () => {
const { id } = useParams(); // Fetch the user ID from URL parameters
const [productDetails, setProductDetails] = useState('');
const [price, setPrice] = useState('');
const [fishImage, setFishImage] = useState(null);
const [fishList, setFishList] = useState([]);
const [name, setName] = useState([]);
const [buyers, setBuyers] = useState([]);
const [orders, setOrders] = useState([]);
const [phoneNumber, setPhoneNumber] = useState([]);
const navigate = useNavigate();
useEffect(() => {
fetchFishData();
}, []);


const fetchOrders = async () => {
  try {
    // Fetch order data from Supabase for the specific seller (using sellerId)
    const { data: orderData, error } = await supabase
      .from('order')
      .select('*')
      .eq('sellerId', id);

    if (error) {
      console.error('Error fetching order data:', error);
    } else {
      setOrders(orderData);
    }
  } catch (error) {
    console.error('Error fetching order data:', error.message);
  }
};

useEffect(() => {
  fetchOrders();
}, []);

const fetchFishData = async () => {
// Fetch fish data for the current seller from Supabase
const { data, error } = await supabase
.from('fish')
.select()
.eq('UserId', id); // Use the fetched user ID as the filter
if (error) {
  console.error('Error fetching fish data:', error);
} else {
  setFishList(data);
}
};

//Fetch user name from users table and set it to name state
useEffect(() => {
const fetchUserName = async () => {
const { data, error } = await supabase
.from('users')
.select('*')
.eq('id', id);
if (error) {
    console.error('Error fetching user data:', error);
} else {
    setName(data);
}
};
fetchUserName();
}, []);

useEffect(() => {
const fetchBuyers = async () => {
const { data, error } = await supabase
.from('users')
.select('')
.eq('role', 'buyer');
if (error) {
    console.error('Error fetching user data:', error);
} else {
    setBuyers(data);
}
};
fetchBuyers();
}, []);
const handleImageUpload = async (e) => {
const file = e.target.files[0];
setFishImage(file);
};

const handleSubmit = async (e) => {
e.preventDefault();
if (!fishImage) {
  alert('Please select an image.');
  return;
}

try {
  const filePath = `images/${fishImage.name}`;
  const { error: uploadError } = await supabase.storage
    .from('fish-images')
    .upload(filePath, fishImage);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const imageUrl = `https://yshbqvoljiklezemofdl.supabase.co/storage/v1/object/public/fish-images/${filePath}`;
  // Save fish data to Supabase
  const { data, error } = await supabase
    .from('fish')
    .insert([{ UserId: id, productDetails, price, fishImage: imageUrl }]); // Use the fetched user ID when saving fish data
  if (error) {
    console.error('Error saving fish data:', error);
  } else {
    console.log('Fish data saved successfully:', data);
    // Reset form inputs and fetch updated fish data
    setProductDetails('');
    setPrice('');
    setFishImage(null);
    fetchFishData();
  }
} catch (error) {
  console.error('Error uploading fish image:', error);
}
};

const handleViewOrderDetails = () => {
  // Redirect to OrderDetails component with orderId as a URL parameter
  navigate(`/seller-details/${id}`);
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

return (
<div>
<h2>welcome Back</h2>
{name.map((user) => (
    <h3 key={user.id}>{user.firstName} {user.lastName}</h3>
))}
<br></br>
<h2>Add Fish To sell</h2>
<br></br>
<form onSubmit={handleSubmit}>
<div className="form-group">
<label htmlFor="productDetails">Product Details:</label>
<textarea
id="productDetails"
value={productDetails}
onChange={(e) => setProductDetails(e.target.value)}
className="form-control"
required
/>
</div>
<div className="form-group">
<label htmlFor="price">Price:</label>
<input
type="number"
id="price"
value={price}
onChange={(e) => setPrice(e.target.value)}
className="form-control"
required
/>
</div>
<div className="form-group">
<label htmlFor="fishImage">Fish Image:</label>
<input
         type="file"
         accept="image/*"
         onChange={handleImageUpload}
         className="form-control-file"
       />
</div>
<button type="submit" className="btn btn-primary">Save Fish</button>
</form>
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
        Add Phone Number
      </button>
      </>

<br></br>
  <h2>Fish List </h2>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Product Details</th>
        <th>Price</th>
        <th>Fish Image</th>
      </tr>
    </thead>
    <tbody>
      {fishList.map((fish) => (
        <tr key={fish.id}>
          <td>{fish.productDetails}</td>
          <td>${fish.price}</td>
          <td><img src={fish.fishImage} alt="Fish" style={{ maxWidth: '200px' }} /></td>
        </tr>
      ))}
    </tbody>
  </Table>
<h2>Buyers by Location</h2>
<Table striped bordered hover>
    <thead>
        <tr>
            <th>Location</th>
            <th>Buyer Name</th>
            <th>Buyer Email</th>
        </tr>
    </thead>
    <tbody>
       {buyers.map((buyer) => (
        <tr key={buyer.id}>
            <td>{buyer.location}</td>
            <td>{buyer.firstName} {buyer.lastName}</td>
            <td>{buyer.email}</td>
        </tr>
         ))}
    </tbody>

</Table>
<div className="mt-4">
  <h2>Orders Placed</h2>
  <Table className="table">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Date</th>
        <th>View</th>
        <th>Seller Id</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.id}>
          <td>{order.orderId}</td>
          <td>{order.orderDate}</td>
          <td>
            <button className="btn btn-success" onClick={() => handleViewOrderDetails(order.orderId)}>
              View
            </button>
          </td>
          <td>{order.sellerId}</td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

</div>





);
};

export default SellerProfile;