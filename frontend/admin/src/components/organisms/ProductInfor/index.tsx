import { memo } from 'react';
import { Descriptions, Form, Input, Tag } from 'antd';
import type { DescriptionsProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { ColorSwatch } from '@/components/atoms';

export const ProductInfor = memo(
  ({
    action,
    description,
    materials,
    care,
    colors,
    sizes,
  }: {
    action: 'create' | 'show' | 'edit';
    description?: string;
    materials?: string;
    care?: string;
    colors?: any[];
    sizes?: any[];
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
          <div className='flex flex-wrap gap-2'>
            {colors?.map((c) => (
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
            {sizes?.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        ),
      },
    ];

    return (
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          {action == 'show' ? ( <>
          <span className='text-md font-semibold'>Description</span>
            <span className='text-sm'>{description}</span>
            </>
          ) : (
            <Form.Item
              layout='vertical'
              label='Description'
              name='description'
              rules={[
                {
                  required: true,
                  message: `Product's description is required`,
                },
              ]}
            >
              <Input.TextArea placeholder='Describe the product' rows={5} />
            </Form.Item>
          )}
        </div>

        {action == 'show' ? (
          <Descriptions items={items} bordered size='small' />
        ) : (
          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='materials'
              label='Materials'
              rules={[
                {
                  required: true,
                  message: `Product's materials is required`,
                },
              ]}
            >
              <Input.TextArea placeholder='e.g. 80% Cotton' rows={3} />
            </Form.Item>
            <Form.Item
              name='care'
              label='Care'
              rules={[
                {
                  required: true,
                  message: `Product's care is required`,
                },
              ]}
            >
              <Input.TextArea placeholder='e.g. Dry clean only' rows={3} />
            </Form.Item>
          </div>
        )}
      </div>
    );
  },
);
