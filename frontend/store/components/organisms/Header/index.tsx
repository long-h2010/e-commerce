'use client';

import { HeaderMenu, Logo, ProfileMenu } from '@/components/molecules';
import { useAuthStore } from '@/stores';
import {
  BellOutlined,
  ShoppingCartOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { Badge, Button } from 'antd';
import Link from 'next/link';

export const Header = () => {
  const { user } = useAuthStore();

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
        {user ? (
          <ProfileMenu />
        ) : (
          <Button type='link' href='/login' className='!text-brand'>
            Login
          </Button>
        )}
        <TranslationOutlined style={{ color: '#5e5e5e' }} />
      </div>
    </header>
  );
};
