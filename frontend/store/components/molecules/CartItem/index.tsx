'use client';

import { Price, StockStatus } from '@/components/atoms';
import { calSalePrice } from '@/lib/utils';
import { ProductCart } from '@/types';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Divider, Image, InputNumber } from 'antd';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';

export const CartItem = memo(
  ({
    item,
    onChangeQuantity,
    onDelete,
  }: {
    item: ProductCart;
    onChangeQuantity: (id: string, price: number) => void;
    onDelete: (id: string) => void;
  }) => {
    const {
      id,
      productId,
      variantId,
      thumbnail,
      name,
      color,
      size,
      price,
      saleValue = 0,
      quantity,
      stock,
    } = item;

    const [newQuantity, setNewQuantity] = useState<number>(quantity);

    const totalPrice: number = useMemo(
      () => calSalePrice({ price, saleValue }) * newQuantity,
      [newQuantity],
    );

    return (
      <div
        className={`flex gap-4 p-3 !w-full bg-gray-100 ${stock == 0 ? 'opacity-50' : ''} rounded-lg`}
      >
        <Image
          src={thumbnail}
          loading='lazy'
          alt={name}
          width={120}
          className='!w-[120px] !min-w-[120px] object-cover'
        />
        <div className='flex flex-col gap-3 w-full'>
          <div className='flex justify-between'>
            <Link
              href={`/products/${productId}`}
              className='text-lg !text-brand font-bold'
            >
              {name}
            </Link>
            <Button
              icon={<CloseOutlined />}
              type='text'
              danger
              onClick={() => onDelete(id)}
            />
          </div>
          <div className='flex w-full justify-between items-center text-sm text-gray-500'>
            <div className='flex items-center'>
              <p>{color.name}</p>
              <Divider orientation='vertical' />
              <p>{size}</p>
            </div>
            <InputNumber
              min={1}
              max={stock}
              defaultValue={quantity}
              disabled={stock == 0}
              onChange={(value) => {
                setNewQuantity(value ?? 1);
                onChangeQuantity(variantId, value ?? 1);
              }}
            />
          </div>
          <div className='flex justify-between'>
            <Price price={price} saleValue={saleValue} />
            <Price price={totalPrice} />
          </div>
          <div className='flex justify-end items-end mt-auto'>
            <StockStatus stock={stock} />
          </div>
        </div>
      </div>
    );
  },
);
