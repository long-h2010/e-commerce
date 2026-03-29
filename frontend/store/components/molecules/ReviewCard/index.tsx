'use client';

import { Review } from '@/types';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Rate } from 'antd';
import { Typography } from 'antd';

const { Paragraph, Text } = Typography;

export const ReviewCard = ({ review }: { review: Review }) => {
  const { user, rating, content, createdAt } = review;
  
  return (
    <div className='flex flex-col w-full gap-3'>
      <div className='flex justify-between'>
        <div className='flex gap-3 items-center'>
          {user.avatar ? (
            <Avatar src={user.avatar} />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )}
          <div className='flex flex-col'>
            <Text strong>{user.name}</Text>
            <Text type='secondary'>{createdAt.toDateString()}</Text>
          </div>
        </div>
        <Rate defaultValue={rating} disabled style={{ color: '#f4a261' }} />
      </div>
      <Paragraph ellipsis={{ rows: 3, symbol: 'more' }}>{content}</Paragraph>
    </div>
  );
};
