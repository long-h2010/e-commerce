'use client';

import { ConfigProvider } from 'antd'

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0ea5e9',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
