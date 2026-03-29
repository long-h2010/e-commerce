'use client';

import { CartSummary } from '@/components/molecules';
import { CartList } from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { ProductCart } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Cart() {
  const [items, setItems] = useState<ProductCart[]>([
    {
      productId: '12345',
      name: 'Black T-shirt',
      thumbnail:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=90',
      color: 'Black',
      size: 'M',
      price: 20000,
      salePrice: 1500000,
      quantity: 2,
      stock: 10,
    },
    {
      productId: '35465',
      name: 'Black T-shirt',
      thumbnail:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=90',
      color: 'Black',
      size: 'M',
      price: 20000,
      salePrice: 1500000,
      quantity: 2,
      stock: 10,
    },
  ]);

  const onChangleQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [],
  );

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  return (
    <MainTemplate>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 p-20'>
        <div className='lg:col-span-1 lg:order-1'>
          <CartList list={items} onChangleQuantity={onChangleQuantity} />
        </div>
        <div className='lg:order-1 lg:ml-25'>
          <CartSummary subtotal={subtotal} count={items.length} />
        </div>
      </div>
    </MainTemplate>
  );
}
