'use client';

import { Price, StockStatus } from '@/components/atoms';
import { ProductCart } from '@/types';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Divider, Image, InputNumber } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

export const CartItem = ({
  item,
  onChangleQuantity,
}: {
  item: ProductCart;
  onChangleQuantity: (id: string, price: number) => void;
}) => {
  const {
    productId,
    thumbnail,
    name,
    color,
    size,
    price,
    salePrice,
    quantity,
    stock,
  } = item;
  const [totalPrice, setTotalPrice] = useState(price * quantity);

  return (
    <div
      className={`flex gap-4 p-3 w-full bg-gray-100 ${stock == 0 ? 'opacity-50' : ''} rounded-lg`}
    >
      <Image src={thumbnail} alt={name} height={200} width={180} />
      <div className='flex flex-col gap-3 w-full'>
        <div className='flex justify-between'>
          <Link href={`/products/${productId}`} className='text-lg font-bold'>
            {name}
          </Link>
          <Button icon={<CloseOutlined />} type='text' danger />
        </div>
        <div className='flex w-full justify-between items-center text-sm text-gray-500'>
          <div className='flex items-center'>
            <p>{color}</p>
            <Divider orientation='vertical' />
            <p>{size}</p>
          </div>
          <InputNumber
            min={1}
            max={stock}
            defaultValue={quantity}
            disabled={stock == 0}
            onChange={(value) => {
              const newTotalPrice = (value ?? 1) * price;
              setTotalPrice(newTotalPrice);
              onChangleQuantity(productId, value ?? 1);
            }}
          />
        </div>
        <div className='flex justify-between'>
          <Price price={price} oldPrice={salePrice} />
          <Price price={totalPrice} />
        </div>
        <div className='flex justify-end items-end mt-auto'>
          <StockStatus stock={stock} />
        </div>
      </div>
    </div>
  );
};
