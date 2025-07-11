import { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useAppSelector } from '../../services/hooks/hooks';
import { addOrder, clearOrder } from '../../services/reducers/ordersSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useAppSelector((state) => state.burgerConstructor?.bun ?? null);
  const ingredients = useAppSelector(
    (state) => state.burgerConstructor?.ingredients ?? []
  );
  const orderRequest = useAppSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    const newOrder: TOrder = {
      _id: Math.random().toString(36).substring(2, 15),
      number: Math.floor(Math.random() * 100000),
      name: 'идентификатор заказа',
      status: 'Ваш заказ начали готовить',
      ingredients: [bun, ...ingredients, bun].map((item) => item._id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch(addOrder(newOrder));
    navigate(`/order/${newOrder.number}`);
  };

  const closeOrderModal = () => {
    dispatch(clearOrder()); // очистка orderModalData
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
