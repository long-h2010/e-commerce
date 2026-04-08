import {
  EditOutlined,
  MoonOutlined,
  SaveOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Space, Button, Layout, theme, Breadcrumb } from 'antd';
import { themeStore } from '@/stores';
import { useBreadcrumb } from '@refinedev/core';
import { useParams } from 'react-router';

export const Header = () => {
  const { mode, setMode } = themeStore();
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const { breadcrumbs } = useBreadcrumb();
  const params = useParams();

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
        {/* {breadcrumbs.length > 1 && (
          <>
            <Button
              type='text'
              icon={<ArrowLeftOutlined />}
              style={{ color: '#888' }}
            >
              Back
            </Button>
            <Divider type='vertical' />
          </>
        )} */}
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
        {breadcrumbs.length > 1 &&
          (breadcrumbs[1].label == 'Show' ||
            breadcrumbs[1].label == 'Edit') && (
            <Button
              href={`/${breadcrumbs[0].label}/${
                breadcrumbs[1].label == 'Show' ? 'edit' : 'show'
              }/${params.id}`}
              icon={
                breadcrumbs[1].label == 'Show' ? (
                  <EditOutlined />
                ) : (
                  <SaveOutlined />
                )
              }
              color='primary'
              variant='outlined'
            >
              {breadcrumbs[1].label == 'Show' ? 'Edit' : 'Save'}
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
