'use client';

import { Price } from '@/components/atoms';
import { Accordions, Perks } from '@/components/molecules';
import { useCreate, useList } from '@/hooks';
import { formatNumberCount, formatVND } from '@/lib/utils';
import { Color, ProductDetail, ProductVariant } from '@/types';
import {
  CheckOutlined,
  HeartOutlined,
  LoadingOutlined,
  ShoppingCartOutlined,
  StarFilled,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Divider, InputNumber, Radio, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const ProductInfor = ({ product }: { product: ProductDetail }) => {
  const {
    id,
    name,
    purchases,
    colors,
    sizes,
    saleValue = 0,
    avgRating,
    totalReviews,
    description,
  } = product;
  const t = useTranslations('product');

  const [selectedColor, setSelectedColor] = useState<Color>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [activeVariant, setActiveVariant] = useState<ProductVariant>();
  const [quantity, setQuantity] = useState<number>(1);
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success'>(
    'idle',
  );

  const { data: variants } = useList({
    resource: process.env.NEXT_PUBLIC_VARIANTS_ENDPOINT!,
    params: {
      pagination: { page: 1, limit: 0 },
      filters: [{ field: 'productId', operator: 'eq', value: id }],
    },
  });

  const { mutate: addItem } = useCreate({
    resource: process.env.NEXT_PUBLIC_CARTS_ENDPOINT!,
  });

  useEffect(() => {
    if (!variants?.data?.length) return;
    const first = variants.data[0] as ProductVariant;
    setSelectedColor(first.color);
    setSelectedSize(first.size);
    setActiveVariant(first);
  }, [variants]);

  useEffect(() => {
    if (!variants?.data?.length || !selectedColor) return;

    const sizesForColor = variants.data
      .filter((v: ProductVariant) => v.color.name === selectedColor.name)
      .map((v: ProductVariant) => v.size);

    const resolvedSize =
      selectedSize && sizesForColor.includes(selectedSize)
        ? selectedSize
        : sizesForColor[0];

    if (resolvedSize !== selectedSize) {
      setSelectedSize(resolvedSize);
    }

    const matched = variants.data.find(
      (v: ProductVariant) =>
        v.color.name === selectedColor.name && v.size === resolvedSize,
    );

    if (matched) setActiveVariant(matched);
  }, [selectedColor, selectedSize, variants]);

  const activeSizes: string[] = selectedColor
    ? variants?.data
        .filter((v: ProductVariant) => v.color.name === selectedColor.name)
        .map((v: ProductVariant) => v.size)
    : [];

  const handleColorSelect = (colorName: string) => {
    const variant = variants?.data.find(
      (v: ProductVariant) => v.color.name === colorName,
    ) as ProductVariant | undefined;
    if (variant) setSelectedColor(variant.color);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (addStatus !== 'idle') return;

    setAddStatus('loading');
    addItem(
      {
        variant_id: activeVariant?.id,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          setAddStatus('success');
          setTimeout(() => setAddStatus('idle'), 2000);
        },
        onError: () => {
          setAddStatus('idle');
        },
      },
    );
  };

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
          {saleValue != 0 && (
            <span>
              {`Sale off ${saleValue < 1 ? saleValue * 100 + '%' : formatVND(saleValue)}`}
            </span>
          )}
        </Tag>
      </div>

      <div className='flex justify-between'>
        <div className='content-end'>
          {activeVariant && (
            <Price
              price={activeVariant.price}
              saleValue={saleValue}
              className='!text-3xl'
            />
          )}
        </div>

        <div className='text-[13px] text-gray-400 justify-items-end'>
          <p>{formatNumberCount(purchases) + ' ' + t('purchases')}</p>
          <span className='flex items-center'>
            <p className='mr-0.5'>{avgRating}</p>
            <StarFilled style={{ color: '#f4a261' }} />
            <span className='mx-1'>•</span>
            <a href='#reviews' className='italic underline'>
              {totalReviews + ' ' + t('reviews')}
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
              <span className='text-xs font-medium capitalize'>
                {activeVariant?.color?.name}
              </span>
            </div>
            <div className='flex gap-3'>
              {variants?.data &&
                colors.map((c) => (
                  <Button
                    key={c.name}
                    shape='circle'
                    style={{
                      backgroundColor: c.hex,
                      cursor: 'pointer',
                      transform:
                        selectedColor?.name === c.name
                          ? 'scale(1.2)'
                          : 'scale(1)',
                      border:
                        selectedColor?.name === c.name
                          ? '2px solid var(--primary)'
                          : 'none',
                    }}
                    onClick={() => handleColorSelect(c.name)}
                  />
                ))}
            </div>
          </div>

          <div>
            <div className='flex justify-between mb-3'>
              <span className='tracking-widest uppercase'>{t('size')}</span>
              <span className='text-md font-medium capitalize'>{`${t('stock')}: ${activeVariant?.stock}`}</span>
            </div>
            {activeVariant && (
              <Radio.Group
                size='large'
                value={selectedSize}
                optionType='button'
                buttonStyle='solid'
                onChange={(e) => handleSizeSelect(e.target.value)}
              >
                {sizes.map((s) => (
                  <Radio.Button
                    key={s}
                    value={s}
                    disabled={!activeSizes.includes(s)}
                  >
                    {s}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='flex gap-3 mt-10'>
            <InputNumber
              {...{
                mode: 'spinner',
                max: activeVariant?.stock,
                min: 1,
                value: quantity,
                onChange: (value: any) => setQuantity(value),
              }}
            />
            <Button
              className='!p-6 w-full uppercase'
              type='primary'
              icon={
                addStatus === 'loading' ? (
                  <LoadingOutlined spin />
                ) : addStatus === 'success' ? (
                  <CheckOutlined />
                ) : (
                  <ShoppingCartOutlined />
                )
              }
              disabled={activeVariant?.stock == 0 || addStatus !== 'idle'}
              onClick={handleAddToCart}
              loading={addStatus == 'loading'}
            >
              {addStatus === 'success' ? t('add_success') : t('add_to_cart')}
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
