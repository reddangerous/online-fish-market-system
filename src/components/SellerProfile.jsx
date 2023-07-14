import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import supabase from '../supabase';

const SellerProfile = () => {
const { id } = useParams(); // Fetch the user ID from URL parameters
const [productDetails, setProductDetails] = useState('');
const [price, setPrice] = useState('');
const [fishImage, setFishImage] = useState(null);
const [fishList, setFishList] = useState([]);
const [name, setName] = useState([]);
const [buyers, setBuyers] = useState([]);
useEffect(() => {
fetchFishData();
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
</div>





);
};

export default SellerProfile;