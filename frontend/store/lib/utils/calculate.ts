import { Discount, DiscountApplyType, DiscountType } from '@/types';

export const calSalePrice = ({
  price,
  saleValue = 0,
}: {
  price: number;
  saleValue: number;
}) => {
  let money = price;
  if (saleValue < 1) money *= 1 - saleValue;
  else money -= saleValue;

  return money;
};

export const calDiscount = ({
  discount,
  subtotal,
  shippingFee,
}: {
  discount: Discount;
  subtotal: number;
  shippingFee: number;
}) => {
  let dis = 0;
  if (discount.applyTo == DiscountApplyType.ORDER) {
    if (discount.type == DiscountType.PERCENTAGE)
      dis = -(subtotal * discount.value) / 100;
    else {
      const temp = subtotal - discount.value;
      dis = temp > 0 ? -temp : -subtotal;
    }
  } else if (discount.applyTo == DiscountApplyType.SHIPPING) {
    if (discount.type == DiscountType.PERCENTAGE)
      dis = -(shippingFee * discount.value) / 100;
    else {
      const temp = shippingFee - discount.value;
      dis = temp > 0 ? -temp : -shippingFee;
    }
  }
  
  return dis;
};
