import { BrowserRouter, Routes, Route } from 'react-router';
import BaseLayout from './views/BaseLayout';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import FavoritePage from './views/FavoritePage';
import ProductDetail from './views/ProductDetail';
import ProfilePage from './views/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
