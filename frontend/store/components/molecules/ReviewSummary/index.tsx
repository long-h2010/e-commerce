'use client';

import { StarProcess } from '@/components/atoms';
import { RatingSummary } from '@/types';
import { EditOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Modal, Rate } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const ReviewSummnary = ({ summary }: { summary: RatingSummary }) => {
  const t = useTranslations('product');
  const { average, totalReviews, distribution } = summary;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <div className='flex flex-col gap-3 w-full bg-black/2 p-3 rounded-lg'>
      <div className='flex justify-between p-2 text-sm items-center'>
        <div className='flex gap-3 items-center'>
          <span>{average}</span>
          <Rate
            disabled
            defaultValue={average}
            style={{ color: '#f4a261' }}
            size='small'
          />
        </div>
        <span>({`${totalReviews} ${t('reviews')}`})</span>
      </div>
      <div className='flex flex-col gap-3 p-2'>
        {Object.entries(distribution)
          .sort((a, b) => +b[0] - +a[0])
          .map(([key, value]) => (
            <StarProcess key={key} star={+key} percent={value} />
          ))}
      </div>
      <div className='px-10'>
        <Divider size='small' />
      </div>
      <div className='flex flex-col gap-3 p-2'>
        <span className='font-bold'>{t('share_your_review')}</span>
        <Button
          icon={<EditOutlined />}
          className='!p-4'
          onClick={() => setIsOpenModal(true)}
        >
          {t('write_your_review')}
        </Button>
      </div>
      <Modal
        title={
          <h2 className='text-2xl tracking-widest font-semibold py-5'>{t('write_your_review')}</h2>
        }
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
      >
        <Form layout='vertical'>
          <Form.Item
            label={
              <p className='text-xs tracking-widest'>{t('your_rating')}</p>
            }
          >
            <Rate style={{ color: '#f4a261' }} />
          </Form.Item>
          <Form.Item
            label={
              <p className='text-xs tracking-widest'>{t('your_review')}</p>
            }
          >
            <Input.TextArea rows={5}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
