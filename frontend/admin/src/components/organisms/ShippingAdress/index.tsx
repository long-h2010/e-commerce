import { Order } from '@/types';
import { EnvironmentOutlined, FileOutlined, HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';

export const ShippingAddress = ({ order }: { order: Order }) => {
  const { name, phone, city, district, address, notes } = order;

  return (
    <Card>
      <div className='flex flex-col gap-5'>
        <div className='flex gap-1'>
          <HomeOutlined />
          <span className='font-semibold text-[16px]'>Shipping Address</span>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <div className='col-span-1'>
            <div className='flex gap-1 text-gray-500'>
              <UserOutlined />
              <span>Name</span>
            </div>
            <span>{name}</span>
            <Divider size='small' />
          </div>
          <div className='col-span-1'>
            <div className='flex gap-1 text-gray-500'>
              <PhoneOutlined />
              <span>Phone</span>
            </div>
            <span>{phone}</span>
            <Divider size='small' />
          </div>
          <div className='col-span-1'>
            <div className='flex gap-1 text-gray-500'>
              <span>Province / City</span>
            </div>
            <span>{city}</span>
            <Divider size='small' />
          </div>
          <div className='col-span-1'>
            <div className='flex gap-1 text-gray-500'>
              <span>District</span>
            </div>
            <span>{district}</span>
            <Divider size='small' />
          </div>
          <div className='col-span-2'>
            <div className='flex gap-1 text-gray-500'>
              <EnvironmentOutlined />
              <span>Address</span>
            </div>
            <span>{address}</span>
            <Divider size='small' />
          </div>
          <div className='col-span-2'>
            <div className='flex gap-1 text-gray-500'>
              <FileOutlined />
              <span>Notes</span>
            </div>
            <span>{notes || 'Null'}</span>
            <Divider size='small' />
          </div>
        </div>
      </div>
    </Card>
  );
};
