import { PaymentMethod } from '@/types';
import { CreditCardOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const PAYMENT_METHOD_MAP: Record<PaymentMethod, any> = {
  banking: { color: '#2db7f5', icon: <CreditCardOutlined /> },
  cod: { color: '#87d068', icon: <EnvironmentOutlined /> },
};

export const PaymentMethodTag = ({ value }: { value: PaymentMethod }) => {
  const tag = PAYMENT_METHOD_MAP[value];
  return (
    <Tag className='uppercase' color={tag.color} icon={tag.icon}>
      {value}
    </Tag>
  );
};
