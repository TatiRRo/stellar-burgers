import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { AppHeader } from '../app-header/app-header';

import { FeedInfo } from '../feed-info/feed-info';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { useAppDispatch } from '../../services/hooks/hooks';
import { IngredientDetailPage } from '../../pages/ingredient-details/ingredient-details';
import { useAppSelector } from '../../services/hooks/hooks';

import { OrderDetailsPage } from '../../pages/order-details/order-details';
import { OrdersList } from '../../components/orders-list/orders-list';
import { Feed } from '../../pages/feed/feed';

import { fetchIngredients } from '../../services/reducers/ingredientsSlice';
import { getUser } from '../../services/reducers/userSlice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  const background = location.state?.background;

  const closeModal = () => {
    navigate(-1);
  };

  // Загружаем ингредиенты при монтировании
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetailPage />} />
        <Route path='/order/:number' element={<OrderDetailsPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
