import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SellerProfile from './components/SellerProfile';
import FishList from './components/FishList';
import Orders from './components/Orders';
function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
      <Route exact path='/login' element= {<Login />} />  
      <Route path='/signup' element= {<Signup />} />
      <Route path='/seller/:id' element= {<SellerProfile />} />
      <Route path='/buyer/:id' element= {<FishList />} />
      <Route path='/order-details/:orderId' element= {<Orders />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
