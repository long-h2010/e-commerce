import { PaymentStatus } from '@/types';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';

const PAYMENT_STATUS_MAP: Record<PaymentStatus, any> = {
  paid: { status: 'success', icon: <CheckCircleOutlined /> },
  unpaid: { status: 'warning', icon: <ExclamationCircleOutlined /> },
  refunded: { status: 'error', icon: <CloseCircleOutlined /> },
};

export const PaymentStatusTag = ({ value }: { value: PaymentStatus }) => {
  const tag = PAYMENT_STATUS_MAP[value];
  return (
    <Tag className='capitalize' color={tag.status} icon={tag.icon}>
      {value}
    </Tag>
  );
};
