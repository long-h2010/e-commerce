import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Form, Input, Select, Divider, Radio } from 'antd';
import locations from '@/lib/data/location-vn.json';
import { useAuth, useLocation } from '@/hooks';
import { useTranslations } from 'next-intl';
import { formatVND } from '@/lib/utils';

export const InformationStep = ({
  SHIPPING_FEE,
  setShippingFee,
}: {
  SHIPPING_FEE: any;
  setShippingFee: (value: number) => void;
}) => {
  const t = useTranslations('checkout');
  const { user } = useAuth();
  const {
    provinceCode,
    districtCode,
    wardCode,
    provinceOptions,
    districtOptions,
    wardOptions,
    onChangeProvince,
    onChangeDistrict,
    onChangeWard,
  } = useLocation(locations);

  return (
    <>
      <span className='text-base font-semibold mb-5'>
        {t('contact_information')}
      </span>
      <Form.Item
        name='name'
        label={t('name')}
        layout='vertical'
        rules={[{ required: true, message: 'Name is require' }]}
        initialValue={user?.name}
      >
        <Input prefix={<UserOutlined />} placeholder='Nguyen Van A' />
      </Form.Item>
      <div className='flex justify-between gap-5'>
        <Form.Item
          name='email'
          label='Email'
          layout='vertical'
          rules={[
            { required: true, message: 'Email is require' },
            { type: 'email', message: 'Email invalid' },
          ]}
          initialValue={user?.email}
          className='w-full'
        >
          <Input prefix={<MailOutlined />} placeholder='example@email.com' />
        </Form.Item>
        <Form.Item
          name='phone'
          label={t('phone_number')}
          layout='vertical'
          rules={[
            {
              required: true,
              message: 'Phone number is require',
            },
            {
              pattern: /^(0|\+84)\d{9}$/,
              message: 'Phone number invalid',
            },
          ]}
          className='w-full'
          initialValue={user?.phoneNumber}
        >
          <Input prefix={<PhoneOutlined />} placeholder='0901 234 567' />
        </Form.Item>
      </div>
      <Form.Item
        name='address'
        label={t('address')}
        layout='vertical'
        rules={[{ required: true, message: 'Address is require' }]}
      >
        <Input prefix={<EnvironmentOutlined />} placeholder='123 ABC' />
      </Form.Item>
      <div className='flex justify-between gap-3'>
        <Form.Item
          name='city'
          label={t('city')}
          layout='vertical'
          rules={[{ required: true, message: 'City is require' }]}
          className='!w-full'
        >
          <Select
            showSearch={{ optionFilterProp: 'label' }}
            value={provinceCode}
            options={provinceOptions}
            onChange={(_, options) =>
              onChangeProvince(
                Array.isArray(options) ? undefined : options?.code,
              )
            }
          />
        </Form.Item>
        <Form.Item
          name='district'
          label={t('district')}
          layout='vertical'
          rules={[{ required: true, message: 'District is require' }]}
          className='!w-full'
        >
          <Select
            showSearch={{ optionFilterProp: 'label' }}
            value={districtCode}
            options={districtOptions}
            onChange={(_, options) =>
              onChangeDistrict(
                Array.isArray(options) ? undefined : options?.code,
              )
            }
            disabled={!provinceCode}
          />
        </Form.Item>
        <Form.Item
          name='ward'
          label={t('ward')}
          layout='vertical'
          rules={[{ required: true, message: 'Ward is require' }]}
          className='!w-full'
        >
          <Select
            showSearch={{ optionFilterProp: 'label' }}
            value={wardCode}
            options={wardOptions}
            onChange={(_, options) =>
              onChangeWard(Array.isArray(options) ? undefined : options?.code)
            }
            disabled={!districtCode}
          />
        </Form.Item>
      </div>
      <Form.Item name='note' label={t('note')} layout='vertical'>
        <Input.TextArea rows={3} placeholder={t('note_desc')} />
      </Form.Item>
      <Divider />
      <Form.Item
        name='shippingMethod'
        label={
          <span className='text-base font-semibold mb-5'>
            {t('shipping_methods')}
          </span>
        }
        layout='vertical'
        initialValue='standard'
      >
        <Radio.Group
          vertical
          onChange={(e) => setShippingFee(SHIPPING_FEE[e.target.value])}
        >
          <Radio value='standard'>
            <div className='flex gap-3'>
              <span>{t('standard')}</span>
              <span className='text-gray-500'>
                {formatVND(SHIPPING_FEE.standard)}
              </span>
            </div>
          </Radio>
          <Radio value='express'>
            <div className='flex gap-3'>
              <span>{t('express')}</span>
              <span className='text-gray-500'>
                {formatVND(SHIPPING_FEE.express)}
              </span>
            </div>
          </Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};
