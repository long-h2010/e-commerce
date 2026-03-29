'use client';

import { GoogleLoginButton } from '@/components/atoms';
import { Logo } from '@/components/molecules';
import { useAuth } from '@/hooks';
import {
  LockOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Tab = 'login' | 'register';

interface FormState {
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export default function Login() {
  const t = useTranslations('auth');
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [form, setForm] = useState<FormState>({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const tabLoginItems: TabsProps['items'] = [
    {
      key: 'login',
      label: t('login'),
      children: (
        <div className='flex flex-col gap-3.5'>
          <Input
            className='!py-2'
            placeholder={t('phone_number')}
            prefix={<UserOutlined />}
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
          <Input
            className='!py-2'
            placeholder={t('password')}
            prefix={<LockOutlined />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      ),
    },
    {
      key: 'register',
      label: t('register'),
      children: (
        <div className='flex flex-col gap-3.5'>
          <Input
            className='!py-2'
            placeholder={t('full_name')}
            prefix={<UserOutlined />}
          />
          <Input
            className='!py-2'
            placeholder={t('password')}
            prefix={<LockOutlined />}
          />
          <Input
            className='!py-2'
            placeholder={t('confirm_password')}
            prefix={<LockOutlined />}
          />
          <div className='flex gap-3'>
            <Input
              className='!py-2'
              placeholder={t('phone_number')}
              prefix={<PhoneOutlined />}
            />
            <Button color='primary' variant='outlined' className='!h-10'>
              {t('send_otp')}
            </Button>
          </div>
          <Input
            className='!py-2'
            placeholder={t('otp_code')}
            prefix={<SafetyOutlined />}
          />
        </div>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setTab(key as Tab);
  };

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-[440px] px-6 py-14 mx-auto'>
        <div className='flex items-center justify-center'>
          <Logo />
        </div>

        <Tabs
          className='!my-5'
          items={tabLoginItems}
          onChange={handleTabChange}
        />

        {tab === 'login' && (
          <div className='flex items-center justify-between mt-1.5 mb-5'>
            <Checkbox>{t('remember_me')}</Checkbox>
            <a href='#' className='text-[13px] text-brand hover:underline'>
              {t('forgot_password')}
            </a>
          </div>
        )}

        <Button
          type='primary'
          className='w-full !p-5 mb-4'
          onClick={() => {
            if (tab == 'login')
              return login({
                phoneNumber: form.phoneNumber,
                password: form.password,
              });
          }}
        >
          {tab === 'login' ? t('login') : t('register')}
        </Button>

        <Divider className='!border-slate-200 !text-slate-400 !text-xs'>
          {t('or')}
        </Divider>

        <GoogleLoginButton />
      </div>
    </div>
  );
}
