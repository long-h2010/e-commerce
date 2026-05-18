'use client';

import { CartSummary } from '@/components/organisms';
import { CartList } from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { useAlert, useDelete, useList, useUpdate } from '@/hooks';
import { calSalePrice } from '@/lib/utils';
import { ProductCart } from '@/types';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';

export default function Cart() {
  const t = useTranslations('cart');
  const { alert } = useAlert();
  const [items, setItems] = useState<ProductCart[]>([]);
  const [itemsActive, setItemsActive] = useState<ProductCart[]>([]);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data } = useList({
    resource: process.env.NEXT_PUBLIC_CARTS_ENDPOINT!,
  });

  useEffect(() => {
    if (!data?.data) return;
    const mapped: ProductCart[] = data.data;
    setItems(mapped);
    setItemsActive(mapped.filter((p) => p.stock > 0));
  }, [data]);

  const { mutate: updateCart } = useUpdate({
    resource: process.env.NEXT_PUBLIC_CARTS_ENDPOINT!,
  });

  const { mutate: deleteItem } = useDelete({
    resource: process.env.NEXT_PUBLIC_CARTS_ENDPOINT!,
  });

  const onChangeQuantity = useCallback(
    (variantId: string, quantity: number) => {
      setItemsActive((prev) =>
        prev.map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item,
        ),
      );

      if (debounceRef.current[variantId]) {
        clearTimeout(debounceRef.current[variantId]);
      }

      debounceRef.current[variantId] = setTimeout(() => {
        updateCart({ id: '', variables: { variantId, quantity } });
        delete debounceRef.current[variantId];
      }, 500);
    },
    [],
  );

  const handleDeleteItem = (id: string) => {
    deleteItem(
      { id },
      {
        onSuccess: () => {
          setItems((prev) => prev.filter((item) => item.id !== id));
          alert.success(t('remove_success'), 'Deleted');
        },
        onError: () => alert.error(t('remove_fail'), 'Delete fail'),
      },
    );
  };

  const subtotal = useMemo(() => {
    return itemsActive.reduce(
      (total, item: ProductCart) =>
        total +
        calSalePrice({ price: item.price, saleValue: item.saleValue ?? 0 }) *
          item.quantity,
      0,
    );
  }, [itemsActive]);

  return (
    <MainTemplate>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 p-20'>
        <div className='lg:col-span-1 lg:order-1'>
          <CartList
            list={items}
            onChangeQuantity={onChangeQuantity}
            onDelete={handleDeleteItem}
          />
        </div>
        <div className='lg:order-1 lg:ml-25'>
          <CartSummary subtotal={subtotal} count={itemsActive.length} />
        </div>
      </div>
    </MainTemplate>
  );
}
