import React, { useState, useEffect } from 'react';
import  supabase  from '../supabase'; // Assuming you have a Supabase client instance set up

const FishList = ({ user }) => {
  const [fishList, setFishList] = useState([]);

  useEffect(() => {
    fetchFishData();
  }, []);

  const fetchFishData = async () => {
    // Fetch fish data from Supabase
    const { data, error } = await supabase
      .from('fish')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching fish data:', error);
    } else {
      setFishList(data);
    }
  };

  const handleAddToCart = async (fishId) => {
    // Perform actions when the user adds the fish to the cart
    // For example, you can update the cart state or perform an API call
    console.log(`Fish with ID ${fishId} added to cart`);
  };

  return (
    <div>
      <h2>Fish List</h2>
      <ul className="list-group">
        {fishList.map((fish) => (
          <li key={fish.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{fish.productDetails}</h4>
                <p>Price: ${fish.price}</p>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(fish.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FishList;
