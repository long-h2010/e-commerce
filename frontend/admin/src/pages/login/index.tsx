'use client';

import { Logo } from '@/components/atoms';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@refinedev/core';
import { Button, Input, Layout } from 'antd';
import { useState } from 'react';

interface FormState {
  username: string;
  password: string;
}

export const Login = () => {
  const { mutate: login } = useLogin();
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>();

  return (
    <Layout className='flex !min-h-screen items-center justify-center'>
      <div className='w-full max-w-[440px] px-6 py-14 mx-auto'>
        <div className='flex items-center justify-center mb-10'>
          <Logo />
        </div>
        <div className='flex flex-col gap-3.5'>
          <Input
            className='!py-2'
            placeholder='Enter your username'
            prefix={<UserOutlined />}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            className='!py-2'
            placeholder='Enter your password'
            prefix={<LockOutlined />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <span className='text-xs text-red-500'>{error}</span>}
        </div>
        <Button
          type='primary'
          className='w-full !p-5 !mt-5'
          onClick={() =>
            login(form, {
              onError: (e: any) =>
                setError(
                  e?.response?.data?.detail ||
                    'Invalid username or password. Please try again.',
                ),
            })
          }
        >
          Login
        </Button>
      </div>
    </Layout>
  );
};
