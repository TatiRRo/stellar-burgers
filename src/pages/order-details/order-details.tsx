import styles from './order-details.module.css';

import { useParams } from 'react-router-dom';
import { OrderDetailsUI } from '../../components/ui/order-details/order-details';

export const OrderDetailsPage = () => {
  const { number } = useParams();

  const parsedNumber = number ? parseInt(number, 10) : 0;

  return (
    <main className={styles.main}>
      <OrderDetailsUI orderNumber={parsedNumber} />
    </main>
  );
};
