import { ShoppingOutlined } from '@ant-design/icons';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-brand hover:opacity-50"
    >
      <ShoppingOutlined className="text-xl align-middle pb-[4px]" />
      <span className='text-sm'>{process.env.NEXT_PUBLIC_APP_NAME}</span>
    </Link>
  );
};
