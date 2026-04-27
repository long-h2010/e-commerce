import { toSlug } from '@/lib/utils';
import { useCreate } from '@refinedev/core';
import { Button, Drawer, Form, Input, TreeSelect } from 'antd';

export const AddCategoryDrawer = ({
  open,
  setOpen,
  parentCategoriesOptions,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentCategoriesOptions: any[];
}) => {
  const [form] = Form.useForm();
  const { mutate: createCategory } = useCreate();

  const handleCreate = () => {
    form.validateFields().then((values) => {
      createCategory(
        {
          resource: import.meta.env.VITE_CATEGORIES_ENDPOINT,
          values: { ...values },
        },
        {
          onSuccess: () => {
            form.resetFields();
            setOpen(false);
          },
        },
      );
    });
  };

  return (
    <Drawer
      title='New Category'
      open={open}
      onClose={() => setOpen(false)}
      footer={
        <div className='flex justify-end gap-3 my-3'>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type='primary' onClick={handleCreate}>
            Create
          </Button>
        </div>
      }
    >
      <Form form={form} className='flex flex-col gap-5'>
        <Form.Item
          label='Name'
          name='category'
          rules={[{ required: true, message: 'Category name is required!' }]}
        >
          <Input
            placeholder='e.g. T-Shirts'
            onChange={(e) => form.setFieldValue('slug', toSlug(e.target.value))}
          />
        </Form.Item>
        <Form.Item name='parentId' label='Parent Category'>
          <TreeSelect
            treeData={parentCategoriesOptions}
            placeholder='None (top level)'
            allowClear
            treeDefaultExpandAll
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label='Slug'
          name='slug'
          rules={[{ required: true, message: 'Slug is required!' }]}
        >
          <Input placeholder='e.g. t-shirts' />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
