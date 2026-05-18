'use client';

import { BankOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { Divider, Form, Radio, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { formatVND } from '@/lib/utils';
import { PaymentMethod, PaymentStatus } from '@/types';
import { QRCode } from '@/components/molecules';
import { useRouter } from 'next/navigation';

export const PaymentsStep = ({
  confirm,
  orderId,
  orderCode,
  amount,
  paymentMethod,
  setPaymentMethod,
  qrCode,
  transferDetail,
}: {
  confirm: boolean;
  amount: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  orderId?: string;
  orderCode?: string;
  qrCode?: string;
  transferDetail?: string;
}) => {
  const t = useTranslations('checkout');
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('waiting');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const PAYMENT_METHODS: {
    value: PaymentMethod;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 'banking',
      label: t('payment_methods.banking'),
      icon: <BankOutlined />,
    },
    {
      value: 'cod',
      label: t('payment_methods.cod'),
      icon: <MoneyCollectOutlined />,
    },
  ];

  const handleMethodChange = (m: PaymentMethod) => {
    clearInterval(timerRef.current!);
    setPaymentMethod(m);
    setStatus('waiting');
  };

  const handleRefreshQR = () => {
    clearInterval(timerRef.current!);
    setStatus('waiting');
  };

  const handlePaymentSuccess = () => {
    router.push(`/order-success?orderId=${orderId}`);
  };

  return (
    <div className='flex flex-col gap-5'>
      <span className='text-base font-semibold'>{t('payment_method')}</span>

      <Form.Item
        name='paymentMethod'
        initialValue='banking'
        rules={[
          { required: true, message: 'Vui lòng chọn phương thức thanh toán' },
        ]}
      >
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => handleMethodChange(e.target.value)}
          className='w-full'
        >
          <div className='grid grid-cols-2 gap-3'>
            {PAYMENT_METHODS.map((pm) => (
              <Radio.Button
                key={pm.value}
                value={pm.value}
                disabled={pm.value !== paymentMethod && confirm}
                className='!h-auto !text-left !rounded-lg !px-4 !py-3'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{pm.icon}</span>
                  <span className='text-sm font-medium'>{pm.label}</span>
                </div>
              </Radio.Button>
            ))}
          </div>
        </Radio.Group>
      </Form.Item>

      {paymentMethod === 'banking' &&
        confirm &&
        qrCode &&
        orderId &&
        orderCode &&
        transferDetail && (
          <>
            <Divider className='!my-1' />
            <QRCode
              key={orderId}
              qrCode={qrCode}
              orderId={orderId}
              amount={amount}
              status={status}
              setStatus={setStatus}
              handleRefreshQR={handleRefreshQR}
              onPaymentSuccess={handlePaymentSuccess}
              transferDetail={transferDetail}
            />
          </>
        )}

      {paymentMethod === 'cod' && (
        <div className='flex flex-col items-center gap-4 py-4'>
          <p className='text-sm text-gray-500 text-center leading-relaxed'>
            {t('cod_desc', { amount: formatVND(amount) })}
          </p>
        </div>
      )}
    </div>
  );
};
