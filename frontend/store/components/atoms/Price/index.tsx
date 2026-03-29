import { formatVND } from '@/lib/utils';
import { Typography } from 'antd';

const { Text } = Typography;

export const Price = ({
  price,
  oldPrice,
  className
}: {
  price: number;
  oldPrice?: number;
  className?: string;
}) => {
  return (
    <span>
      <Text strong className={className}>{formatVND(price)}</Text>
      {oldPrice && (
        <Text delete type='secondary' className='!text-[0.8em] ml-2'>
          {formatVND(oldPrice)}
        </Text>
      )}
    </span>
  );
};
