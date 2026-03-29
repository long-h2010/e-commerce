import { HeaderMenu, Logo } from '@/components/molecules';
import {
  BellOutlined,
  ShoppingCartOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import Link from 'next/link';

export const MainHeader = () => {
  return (
    <header className='flex w-full sticky top-0 px-16 items-center justify-between bg-white z-100'>
      <Logo />
      <div className='ml-auto'>
        <HeaderMenu />
      </div>
      <div className='flex items-center gap-5 ml-5'>
        <Link href='/cart'>
          <ShoppingCartOutlined style={{ color: 'black' }} />
        </Link>
        <Badge dot>
          <BellOutlined style={{ color: 'black' }} />
        </Badge>
        <Avatar />
        <TranslationOutlined style={{ color: '#5e5e5e' }} />
      </div>
    </header>
  );
};
