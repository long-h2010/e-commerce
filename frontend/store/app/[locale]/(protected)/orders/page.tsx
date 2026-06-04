'use client';

import { HistoryItem } from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { useList } from '@/hooks';
import { Order } from '@/types';
import { Empty, Skeleton, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const STATUS_TABS = [
  'all',
  'pending',
  'confirmed',
  'shipping',
  'delivered',
  'cancelled',
] as const;

export default function Orders() {
  const t = useTranslations('order');
  const [orders, setOrders] = useState<Order[]>([]);

  const { data, isLoading } = useList({
    resource: process.env.NEXT_PUBLIC_GET_USER_ORDERS_ENDPOINT!,
    params: {
      pagination: { page: 1, limit: 0 },
      sorters: [{ field: 'createdAt', order: 'desc' }],
    },
  });

  useEffect(() => setOrders(data?.data ?? []), [data]);

  return (
    <MainTemplate>
      <div className='flex flex-col py-8 px-4'>
        <h1 className='mx-auto text-lg font-medium mb-6'>{t('my_orders')}</h1>

        <Tabs
          centered
          items={STATUS_TABS.map((s) => ({
            key: s,
            label: t(`order_status.${s}`),
            children: (
              <div className='justify-center'>
                {isLoading ? (
                  <Skeleton />
                ) : orders.length === 0 ? (
                  <Empty />
                ) : (
                  <div className='grid gird-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                    {orders
                      .filter((order) =>
                        s !== 'all' ? order.orderStatus == s : order,
                      )
                      .map((order: Order) => (
                        <HistoryItem key={order.id} order={order} />
                      ))}
                  </div>
                )}
              </div>
            ),
          }))}
          className='!mx-auto'
        />
      </div>
    </MainTemplate>
  );
}
