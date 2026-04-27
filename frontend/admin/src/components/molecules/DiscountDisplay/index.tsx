import { formatVND } from '@/lib/utils';
import { DiscountType } from '@/types';
import { CopyOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

export const DiscountDisplay = ({
  name,
  code,
  type,
  value,
}: {
  name: string;
  code: string;
  type: DiscountType;
  value: number;
}) => {
  return (
    <div className='flex flex-col gap-1'>
      <span className='font-semibold'>{name}</span>
      <div className='flex'>
        <Tag color='red'>
          - {type == DiscountType.FIXED ? formatVND(value) : value + '%'}
        </Tag>
        <Tag icon={<CopyOutlined />}>{code}</Tag>
      </div>
    </div>
  );
};
