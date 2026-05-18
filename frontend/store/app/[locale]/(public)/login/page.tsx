'use client';

import { GoogleLoginButton } from '@/components/atoms';
import { Logo } from '@/components/molecules';
import { LoginForm, RegisterForm } from '@/components/organisms';
import { useAlert, useAuth, useCreate } from '@/hooks';
import { Button, Checkbox, Divider, Form, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Tab = 'login' | 'register';

export default function Login() {
  const t = useTranslations('auth');
  const { login, register } = useAuth();
  const { toast } = useAlert();
  const [tab, setTab] = useState<Tab>('login');
  const [form] = Form.useForm();
  const [error, setError] = useState<string>();
  const { mutate: sendOtp, isPending } = useCreate({
    resource: process.env.NEXT_PUBLIC_SEND_OTP_ENDPOINT!,
  });

  const handleTabChange = (key: string) => {
    setError('');
    setTab(key as Tab);
  };

  const handleSendOtp = () => {
    const email = form.getFieldValue('email');

    if (!email) {
      form.validateFields(['email']);
      return;
    }

    sendOtp({ email });
  };

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-[440px] px-6 py-14 mx-auto'>
        <div className='flex items-center justify-center'>
          <Logo />
        </div>

        <Form
          form={form}
          onValuesChange={() => setError('')}
          onFinish={(values) =>
            tab == 'login'
              ? login(values, {
                  onSuccess: () => {
                    toast.success(t('login_success'));
                  },
                  onError: (e: any) =>
                    setError(e?.response?.data?.detail || t('error')),
                })
              : register(values, {
                  onSuccess: () => {
                    toast.success(t('register_success'));
                  },
                  onError: (e: any) => {
                    const detail = e?.response?.data?.detail;

                    if (Array.isArray(detail)) {
                      const first = detail[0];
                      const field = first?.loc?.[1];
                      const fieldLabel = field
                        ? field.charAt(0).toUpperCase() + field.slice(1)
                        : '';
                      const msg = first?.msg?.replace(
                        'String should have',
                        `${fieldLabel} should have`,
                      );
                      setError(msg);
                    } else if (typeof detail === 'string') {
                      setError(detail);
                    } else {
                      setError(t('error'));
                    }
                  },
                })
          }
          className='!mb-5'
        >
          <Tabs
            className='!mb-3'
            items={[
              {
                key: 'login',
                label: t('login'),
                children: <LoginForm />,
              },
              {
                key: 'register',
                label: t('register'),
                children: (
                  <RegisterForm
                    sendOtp={handleSendOtp}
                    loadingSend={isPending}
                  />
                ),
              },
            ]}
            onChange={handleTabChange}
          />
          {error && <span className='text-xs text-red-500'>{error}</span>}
        </Form>

        {tab === 'login' && (
          <div className='flex items-center justify-between my-5'>
            <Checkbox>{t('remember_me')}</Checkbox>
            <a href='#' className='text-[13px] text-brand hover:underline'>
              {t('forgot_password')}
            </a>
          </div>
        )}

        <Button
          type='primary'
          className='w-full !p-5 mb-4'
          onClick={() => form.submit()}
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
