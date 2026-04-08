import { formatVND } from '@/lib/utils';
import { ProductStatus } from '@/types';
import { Badge, Card, Form, Input, Tag } from 'antd';

export const ProductHeader = ({
  action,
  name,
  price,
  status,
  categories,
}: {
  action: 'edit' | 'show';
  name: string;
  price: number;
  status: ProductStatus;
  categories: string[];
}) => {
  const color =
    status == 'active' ? 'green' : status == 'out of stock' ? 'red' : 'orange';

  const text = {
    green: 'text-green-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
  };

  const badge = {
    status: color,
    text: text[color],
  };

  return (
    <Card>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-4 capitalize'>
          {action == 'show' ? (
            <span className='text-lg font-bold'>{name}</span>
          ) : (
            <Form.Item
              name='name'
              rules={[
                { required: true, message: `Product's name is required` },
              ]}
            >
              <Input
                size='large'
                placeholder='Product name'
              />
            </Form.Item>
          )}
          <Badge
            color={badge.status}
            text={<span className={badge.text}>{status}</span>}
          />
          <div className='flex gap-2'>
            {categories.map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </div>
        </div>
        <span className='text-lg font-bold'>{formatVND(price)}</span>
      </div>
    </Card>
  );
};
