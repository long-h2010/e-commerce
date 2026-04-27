import {
  EditOutlined,
  MoonOutlined,
  PlusOutlined,
  SaveOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Space, Button, Layout, theme, Breadcrumb } from 'antd';
import { useHeaderStore, useThemeStore } from '@/stores';
import { useBreadcrumb } from '@refinedev/core';

const ICON = {
  plus: <PlusOutlined />,
  save: <SaveOutlined />,
  edit: <EditOutlined />,
};

export const Header = () => {
  const { mode, setMode } = useThemeStore();
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const { breadcrumbs } = useBreadcrumb();
  const { title, icon, onClick } = useHeaderStore();

  return (
    <Layout.Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: colorBgContainer,
        color: colorText,
      }}
    >
      <Space>
        <Breadcrumb
          items={breadcrumbs.map((item) => ({
            title: (
              <div className='flex items-center gap-1 capitalize'>
                {item.icon} {item.label}
              </div>
            ),
            href: item.href,
          }))}
        />
      </Space>
      <Space
        direction='horizontal'
        align='end'
        style={{
          padding: '1rem',
        }}
      >
        {title && icon && (
          <Button
            icon={ICON[icon]}
            color='primary'
            variant='outlined'
            onClick={onClick}
          >
            {title}
          </Button>
        )}

        <Button
          onClick={() => {
            setMode(mode === 'light' ? 'dark' : 'light');
          }}
          icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
        />
      </Space>
    </Layout.Header>
  );
};
