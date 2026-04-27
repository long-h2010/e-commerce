import { formatVND } from '@/lib/utils';

export const Price = ({
  price,
  saleValue = 0,
  className,
}: {
  price: number;
  saleValue?: number;
  className?: string;
}) => {
  let money = price;
  if (saleValue < 1)
    money *= 1 - saleValue
  else
    money -= saleValue

  return (
    <span>
      <span className={`${className} font-semibold`}>
        {formatVND(money)}
      </span>
      {saleValue != 0 && (
        <span className='!text-[0.8em] ml-2 line-through'>
          {formatVND(price)}
        </span>
      )}
    </span>
  );
};
