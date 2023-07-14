import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SellerProfile from './components/SellerProfile';
import FishList from './components/FishList';
function App() {
  return (
  <BrowserRouter>
      <Routes>
      <Route exact path='/login' element= {<Login />} />  
      <Route path='/signup' element= {<Signup />} />
      <Route path='/seller/:id' element= {<SellerProfile />} />
      <Route path='/buyer/:id' element= {<FishList />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
