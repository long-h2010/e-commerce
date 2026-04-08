import { memo } from 'react';
import { Descriptions, Tag } from 'antd';
import type { DescriptionsProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { ColorSwatch } from '@/components/atoms';

export const ProductInfor = memo(
  ({
    description,
    materials,
    care,
    colors,
    sizes,
  }: {
    description: string;
    materials: string;
    care: string;
    colors: any[];
    sizes: any[];
  }) => {
    const items: DescriptionsProps['items'] = [
      {
        key: 'materials',
        label: 'Materials',
        children: materials,
        span: 3,
      },
      {
        key: 'care',
        label: 'Care',
        children: care,
        span: 2,
      },
      {
        key: 'origin',
        label: (
          <div className='flex gap-1 items-center'>
            <GlobalOutlined />
            <span>Origin</span>
          </div>
        ),
        children: 'Viet Nam',
        span: 1,
      },
      {
        key: 'color',
        label: 'Color',
        children: (
          <div className='flex gap-2'>
            {colors.map((c) => (
              <ColorSwatch key={c.hex} {...c} />
            ))}
          </div>
        ),
      },
      {
        key: 'size',
        label: 'Size',
        children: (
          <div className='flex gap-3'>
            {sizes.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        ),
      },
    ];

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <span className='text-md font-semibold'>Description</span>
          <span className='text-sm'>{description}</span>
        </div>

        <Descriptions items={items} bordered size='small' />
      </div>
    );
  },
);
