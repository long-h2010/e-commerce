import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

export const LoginForm = () => {
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
        ]}
      >
        <Input
          className='!py-2'
          placeholder={t('username')}
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
        ]}
      >
        <Input
          className='!py-2'
          placeholder={t('password')}
          type='password'
          prefix={<LockOutlined />}
        />
      </Form.Item>
    </div>
  );
};
