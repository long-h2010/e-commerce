import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { useTranslations } from 'next-intl';

export const RegisterForm = ({
  sendOtp,
  loadingSend,
}: {
  sendOtp: () => void;
  loadingSend: boolean;
}) => {
  const t = useTranslations('auth');
  const validate = useTranslations('validate');

  return (
    <div className='flex flex-col gap-3.5'>
      <Form.Item
        name='username'
        rules={[
          {
            required: true,
            message: validate('require', { field: 'Username' }),
          },
          {
            min: 2,
            message: validate('min_length', {
              field: 'Username',
              length: 2,
            }),
          },
          {
            max: 50,
            message: validate('max_length', {
              field: 'Username',
              length: 50,
            }),
          },
        ]}
      >
        <Input
          className='!py-2'
          placeholder={t('username')}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item
        name='name'
        rules={[
          {
            required: true,
            message: validate('require', { field: 'Name' }),
          },
          {
            min: 2,
            message: validate('min_length', {
              field: 'Name',
              length: 2,
            }),
          },
          {
            max: 50,
            message: validate('max_length', {
              field: 'Name',
              length: 50,
            }),
          },
        ]}
      >
        <Input
          className='!py-2'
          placeholder={t('name')}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[
          {
            required: true,
            message: validate('require', { field: 'Password' }),
          },
          {
            min: 6,
            message: validate('min_length', {
              field: 'Name',
              length: 6,
            }),
          },
          {
            pattern: /[0-9]/,
            message: validate('contain_number', {
              field: 'Password',
            }),
          },
        ]}
      >
        <Input
          className='!py-2'
          placeholder={t('password')}
          type='password'
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Form.Item
        name='confirmPassword'
        rules={[
          {
            required: true,
            message: validate('require', { field: 'Confirm password' }),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(validate('match', { field: 'Passwords' })),
              );
            },
          }),
        ]}
      >
        <Input
          className='!py-2'
          placeholder={t('confirm_password')}
          type='password'
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <div className='flex gap-3'>
        <Form.Item
          name='email'
          className='w-full'
          rules={[
            {
              required: true,
              message: validate('require', { field: 'Email' }),
            },
            {
              type: 'email',
              message: validate('email'),
            },
          ]}
        >
          <Input
            className='!py-2'
            placeholder={t('email')}
            prefix={<MailOutlined />}
          />
        </Form.Item>
        <Button
          color='primary'
          variant='outlined'
          onClick={sendOtp}
          loading={loadingSend}
          className='!h-10'
        >
          {t('send_otp')}
        </Button>
      </div>
      <Form.Item name='otp'>
        <Input
          className='!py-2'
          placeholder={t('otp_code')}
          prefix={<SafetyOutlined />}
        />
      </Form.Item>
    </div>
  );
};
