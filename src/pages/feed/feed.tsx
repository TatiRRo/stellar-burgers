// import { Preloader } from '@ui';
// import { FeedUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
// import { FC } from 'react';

// export const Feed: FC = () => {
//   /** TODO: взять переменную из стора */
//   const orders: TOrder[] = [];

//   if (!orders.length) {
//     return <Preloader />;
//   }

//   <FeedUI orders={orders} handleGetFeeds={() => {}} />;
// };

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { fetchOrders, fetchFeeds } from '../../services/reducers/ordersSlice';
import { FeedUI } from '../../components/ui/pages/feed/feed';

export const Feed = () => {
  const dispatch = useAppDispatch(); // ✅ типизированный
  const { orders } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchFeeds());
  }, [dispatch]);

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
