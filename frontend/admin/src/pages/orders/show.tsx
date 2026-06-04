import { OrderSteps, UserCard } from '@/components/molecules';
import {
  OrderActions,
  OrderInfor,
  OrderItemList,
  ShippingAddress,
} from '@/components/organisms';
import { PageTemplate } from '@/components/templates';
import { Order, OrderStatus } from '@/types';
import { useShow, useUpdate } from '@refinedev/core';
import { useParams } from 'react-router';

const ORDER_STATUS: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipping',
  'delivered',
];

export const OrderShow = () => {
  const { id } = useParams();
  const { result: orderResult } = useShow<Order>();
  const { mutate: updateOrder } = useUpdate();

  const handleUpdateOrderStatus = (stt: OrderStatus) => {
    const currentIndex = ORDER_STATUS.indexOf(stt);

    if (stt)
      updateOrder({
        resource: import.meta.env.VITE_ORDERS_ENDPOINT,
        id: id,
        values: {
          orderStatus:
            stt !== 'cancelled' && stt !== 'delivered'
              ? ORDER_STATUS[currentIndex + 1]
              : stt,
        },
      });
  };

  return (
    <PageTemplate>
      {orderResult && (
        <>
          <OrderSteps status={orderResult.orderStatus!} />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            <div className='col-span-2 flex flex-col gap-10'>
              <OrderItemList order={orderResult} />
              <ShippingAddress order={orderResult} />
            </div>
            <div className='col-span-1 flex flex-col gap-10'>
              <OrderInfor order={orderResult} />
              <UserCard user={orderResult.user!} />
              <OrderActions
                status={orderResult.orderStatus!}
                updateStatus={handleUpdateOrderStatus}
              />
            </div>
          </div>
        </>
      )}
    </PageTemplate>
  );
};
