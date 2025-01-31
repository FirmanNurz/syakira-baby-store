import { createBrowserRouter, RouterProvider } from 'react-router';
import BaseLayout from './views/BaseLayout';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import FavoritePage from './views/FavoritePage';
import ProductDetail from './views/ProductDetail';
import ProfilePage from './views/ProfilePage';

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      },
      {
        path: "/favorites",
        element: <FavoritePage />
      },
      {
        path: "/products/:id",
        element: <ProductDetail />
      },
      {
        path: "/profile",
        element: <ProfilePage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
