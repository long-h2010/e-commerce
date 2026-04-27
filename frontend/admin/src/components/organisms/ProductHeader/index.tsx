import { Price } from '@/components/atoms';
import { BaseCategory, ProductStatus, ProductStatusEnum } from '@/types';
import { Badge, Card, Form, Input, Select, Tag, TreeSelect } from 'antd';

export const ProductHeader = ({
  action,
  name,
  slug,
  price,
  saleValue,
  status,
  categories,
  categoriesOptions,
}: {
  action: 'create' | 'edit' | 'show';
  name?: string;
  slug?: string;
  price?: number;
  saleValue?: number;
  status?: ProductStatus;
  categories?: BaseCategory[];
  categoriesOptions?: any[];
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
        <div className='flex flex-col gap-5 capitalize'>
          {action == 'show' ? (
            <>
              <span className='text-lg font-bold'>{name}</span>
              <span className='text-xs lowercase tracking-wide'>- {slug} -</span>
              <Badge
                color={badge.status}
                text={<span className={badge.text}>{status}</span>}
              />
              <div className='flex gap-2'>
                {categories?.map((c) => (
                  <Tag key={c.id}>{c.category}</Tag>
                ))}
              </div>
            </>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
              <Form.Item
                label={`Product's name`}
                name='name'
                rules={[
                  { required: true, message: `Product's name is required` },
                ]}
              >
                <Input
                  count={{
                    show: true,
                    max: 40,
                  }}
                  size='large'
                  placeholder='e.g. T-Shirt'
                />
              </Form.Item>
              <Form.Item
                label='Slug'
                name='slug'
                rules={[
                  { required: true, message: `Product's slug is required` },
                ]}
              >
                <Input
                  count={{
                    show: true,
                    max: 40,
                  }}
                  placeholder='e.g. t-shirt'
                />
              </Form.Item>
              <Form.Item
                label='Category'
                name='categoryId'
                rules={[
                  { required: true, message: `Product's category is required` },
                ]}
              >
                <TreeSelect
                  placeholder='Category'
                  treeData={categoriesOptions}
                />
              </Form.Item>
              <Form.Item
                label='Status'
                name='status'
                required
                initialValue={ProductStatusEnum.DRAFT}
              >
                <Select
                  placeholder='Status'
                  options={[
                    { value: ProductStatusEnum.ACTIVE, label: 'Active' },
                    {
                      value: ProductStatusEnum.OUTSTOCK,
                      label: 'Out of Stock',
                    },
                    { value: ProductStatusEnum.DRAFT, label: 'Draft' },
                  ]}
                />
              </Form.Item>
            </div>
          )}
        </div>
        {action == 'show' && (
          <Price price={price!} saleValue={saleValue} className='text-xl' />
        )}
      </div>
    </Card>
  );
};
