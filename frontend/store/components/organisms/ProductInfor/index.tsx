'use client';

import { Price } from '@/components/atoms';
import { Accordions, Perks } from '@/components/molecules';
import { formatNumberCount } from '@/lib/utils';
import { ProductDetail } from '@/types';
import {
  HeartOutlined,
  ShoppingCartOutlined,
  StarFilled,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Divider, InputNumber, Radio, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const ProductInfor = ({ product }: { product: ProductDetail }) => {
  const {
    name,
    purchases,
    price,
    colors,
    sizes,
    salePrice,
    rating,
    totalReview,
    description,
  } = product;
  const t = useTranslations('product');
  const [color, setColor] = useState<string>(colors[0].name);

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='serif text-4xl lg:text-5xl font-light tracking-widest'>
          {name}
        </h1>
        <Tag
          icon={<ThunderboltOutlined />}
          color={'error'}
          variant='outlined'
          className='justify-items-end'
        >
          Sale off 20%
        </Tag>
      </div>

      <div className='flex justify-between'>
        <div className='content-end'>
          <Price price={price} oldPrice={salePrice} className='!text-3xl' />
        </div>

        <div className='text-[13px] text-gray-400 justify-items-end'>
          <p>{formatNumberCount(purchases) + ' ' + t('purchases')} </p>
          <span className='flex items-center'>
            <p className='mr-0.5'>{rating}</p>
            <StarFilled style={{ color: '#f4a261' }} />
            <span className='mx-1'>•</span>
            <a href='#reviews' className='italic underline'>
              {totalReview + ' ' + t('reviews')}
            </a>
          </span>
        </div>
      </div>

      <Divider className='!border-slate-200' />

      <div>
        <div className='flex flex-col gap-5 font-semibold'>
          <div>
            <div className='flex justify-between mb-3'>
              <span className='tracking-widest uppercase'>{t('color')}</span>
              <span className='text-xs font-medium capitalize'>{color}</span>
            </div>
            <div className='flex gap-3'>
              {colors.map((c) => (
                <Button
                  key={c.name}
                  shape='circle'
                  style={{
                    backgroundColor: c.hex,
                    cursor: 'pointer',
                    transform: color === c.name ? 'scale(1.2)' : 'scale(1)',
                    border:
                      color === c.name ? '2px solid var(--primary)' : 'none',
                  }}
                  onClick={() => setColor(c.name)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className='mb-3'>
              <span className='tracking-widest uppercase'>{t('size')}</span>
            </div>
            <Radio.Group size='large'>
              {sizes.map((s) => (
                <Radio.Button key={s}>{s}</Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='flex gap-3 mt-10'>
            <InputNumber {...{ mode: 'spinner', defaultValue: 1 }} />
            <Button
              className='!p-6 w-full uppercase'
              type='primary'
              icon={<ShoppingCartOutlined />}
            >
              {t('add_to_cart')}
            </Button>
          </div>
          <Button className='w-full !p-6 uppercase' icon={<HeartOutlined />}>
            {t('add_to_fav')}
          </Button>
        </div>
      </div>

      <Perks />

      <Divider className='!border-slate-200' />

      <Accordions description={description} material='Cotton' />
    </div>
  );
};
