'use client';

import {
  HistorySummary,
  OrderItemList,
  OrderShippingAddress,
} from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { useOne } from '@/hooks';
import { Order } from '@/types';
import { Result, Button, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OrderDetail() {
  const t = useTranslations('order.order_infor');
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  const { data: orderData, isLoading } = useOne({
    resource: process.env.NEXT_PUBLIC_ORDERS_ENDPOINT!,
    id: id!,
    enabled: !!id,
  });

  useEffect(() => {
    if (!orderData) return;

    setOrder(orderData.data);
  }, [orderData]);

  if (!order || isLoading) return <Skeleton />;

  return (
    <MainTemplate>
      <div className='py-10 px-4'>
        <Result
          status={
            order.orderStatus == 'confirmed' ||
            order.orderStatus == 'delivered'
              ? 'success'
              : order.orderStatus == 'shipping'
                ? 'info'
                : 'error'
          }
          title={t(`title.${order.orderStatus}`)}
          subTitle={
            <div className='flex flex-col gap-5'>
              <span className='mb-5'>{t(`desc.${order.orderStatus}`)}</span>
              {order && (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mb-5'>
                  <HistorySummary isLoading={isLoading} order={order} />
                  <div className='flex flex-col gap-4'>
                    <OrderItemList isLoading={isLoading} items={order.items} />
                    <OrderShippingAddress
                      isLoading={isLoading}
                      orderShippingAddress={order}
                    />
                  </div>
                </div>
              )}
            </div>
          }
          extra={[
            <Button
              key='orders'
              size='large'
              onClick={() => router.push('/orders')}
            >
              {t('view_orders')}
            </Button>,
            <Button
              key='home'
              type='primary'
              size='large'
              onClick={() => router.push('/')}
            >
              {t('continue_shopping')}
            </Button>,
          ]}
        />
      </div>
    </MainTemplate>
  );
}
