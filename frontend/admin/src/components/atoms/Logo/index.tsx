import { ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

export const Logo = () => {
  return (
    <Link
      to='/'
      className='flex items-center gap-2 font-bold'
    >
      <ShoppingOutlined className='text-xl align-middle pb-[4px]' />
      <span className='text-sm'>{import.meta.env.VITE_APP_NAME}</span>
    </Link>
  );
};
