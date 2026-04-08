import { Card, Divider, Switch } from 'antd';

export const ProductSettings = () => {
  return (
    <Card>
      <span className='text-sm font-bold'>Quick Settings</span>
      <Divider />
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <span>Featured Product</span>
          <Switch />
        </div>
        <div className='flex justify-between'>
          <span>Visible on Store</span>
          <Switch checked />
        </div>
      </div>
    </Card>
  );
};
