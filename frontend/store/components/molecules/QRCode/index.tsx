'use client';

import { useAlert } from '@/hooks';
import { api } from '@/lib/api/axios';
import {
  formatVND,
  timeCountdown,
  transformKeysToCamelCase,
} from '@/lib/utils';
import { PaymentStatus } from '@/types';
import {
  LoadingOutlined,
  CheckCircleFilled,
  CopyOutlined,
} from '@ant-design/icons';
import { Button, QRCode as QR } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const BANK_CONFIG = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME,
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT,
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME,
  qrExpireSeconds: 300,
};

const POLLING_INTERVAL = 3000;

export const QRCode = ({
  qrCode,
  orderId,
  amount,
  transferDetail,
  status,
  setStatus,
  handleRefreshQR,
  onPaymentSuccess,
}: {
  qrCode: string;
  orderId: string;
  amount: number;
  transferDetail: string;
  status: PaymentStatus;
  setStatus: (status: PaymentStatus) => void;
  handleRefreshQR: () => void;
  onPaymentSuccess: () => void;
}) => {
  const t = useTranslations('checkout');
  const { toast } = useAlert();
  const [secondsLeft, setSecondsLeft] = useState(BANK_CONFIG.qrExpireSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== 'waiting') return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setStatus('expired');
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [status]);

  useEffect(() => {
    if (status !== 'waiting' || !orderId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(
          `${process.env.NEXT_PUBLIC_GET_ORDERS_STATUS_ENDPOINT}/${orderId}`,
        );

        const order = transformKeysToCamelCase(data);

        if (order.paymentStatus === 'paid') {
          clearInterval(pollingRef.current!);
          clearInterval(timerRef.current!);
          setStatus('success');
          setTimeout(onPaymentSuccess, 1500);
        }
      } catch {}
    }, POLLING_INTERVAL);

    return () => clearInterval(pollingRef.current!);
  }, [status, orderId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`Đã sao chép ${label}`));
  };

  const progressPercent = (secondsLeft / BANK_CONFIG.qrExpireSeconds) * 100;

  return (
    <div className='flex flex-col items-center gap-4'>
      {status === 'waiting' && (
        <div className='flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg px-4 py-2 text-sm w-full'>
          <LoadingOutlined spin />
          <span>
            {t('payment_expire_desc', { seconds: timeCountdown(secondsLeft) })}
          </span>
        </div>
      )}
      {status === 'success' && (
        <div className='flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-4 py-2 text-sm w-full'>
          <CheckCircleFilled />
          <span>{t('payment_success')}</span>
        </div>
      )}
      {status === 'expired' && (
        <div className='flex items-center justify-between bg-red-50 rounded-lg px-4 py-2 text-sm w-full'>
          <span className='text-red-600'>{t('payment_expire')}</span>
          <Button size='small' onClick={handleRefreshQR}>
            {t('refresh')}
          </Button>
        </div>
      )}

      <div className='relative'>
        <svg width={220} height={220} viewBox='0 0 220 220'>
          <circle
            cx={110}
            cy={110}
            r={105}
            fill='none'
            stroke='#e5e7eb'
            strokeWidth={4}
          />
          <circle
            cx={110}
            cy={110}
            r={105}
            fill='none'
            stroke={
              status === 'success'
                ? '#16a34a'
                : status === 'expired'
                  ? '#dc2626'
                  : '#1D9E75'
            }
            strokeWidth={4}
            strokeDasharray={2 * Math.PI * 105}
            strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
            strokeLinecap='round'
            transform='rotate(-90 110 110)'
            style={{
              transition: 'stroke-dashoffset 1s linear, stroke 0.3s',
            }}
          />
        </svg>

        <div
          className='absolute inset-0 flex items-center justify-center'
          style={{
            filter: status === 'expired' ? 'blur(4px)' : 'none',
            opacity: status === 'expired' ? 0.4 : 1,
          }}
        >
          <div className='w-[175px] h-[175px] border-2 border-green-500 rounded-xl flex items-center justify-center bg-white'>
            <QR value={qrCode} />
          </div>
        </div>
      </div>

      <div className='text-center'>
        <p className='text-sm text-gray-500 mb-1'>{t('transfer_amount')}</p>
        <p className='text-2xl font-semibold text-green-700'>
          {formatVND(amount)}
        </p>
      </div>

      <div className='w-full grid grid-cols-2 gap-2'>
        {[
          { label: t('bank'), value: BANK_CONFIG.bankName, copy: false },
          {
            label: t('account_number'),
            value: BANK_CONFIG.accountNumber,
            copy: true,
          },
          {
            label: t('account_name'),
            value: BANK_CONFIG.accountName,
            copy: false,
          },
          {
            label: t('transfer_content'),
            value: transferDetail,
            copy: true,
          },
        ].map((item) => (
          <div
            key={item.label}
            className='bg-gray-50 rounded-lg px-3 py-2 flex flex-col gap-1'
          >
            <span className='text-xs text-gray-400'>{item.label}</span>
            <div className='flex items-center gap-1'>
              {item.copy && (
                <Button
                  type='text'
                  size='small'
                  icon={<CopyOutlined />}
                  className='!p-0 !h-auto !text-gray-400'
                  onClick={() => handleCopy(item.value!, item.label)}
                />
              )}
              <span className='text-sm font-medium truncate'>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      <span className='text-xs text-red-500'>{t('transfer_desc')}</span>
    </div>
  );
};
