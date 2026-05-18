import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { LogoutOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

export const ProfileMenu = () => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: 'My Orders',
      icon: <ShoppingOutlined />,
      onClick: () => router.push('/orders'),
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        authService.logout();
        clearAuth();
        router.push('/');
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} placement='bottomRight'>
      <Avatar
        src={
          user?.avatar !== '/default-avatar.png'
            ? user?.avatar
            : `/images/default-avatar.png`
        }
      />
    </Dropdown>
  );
};
