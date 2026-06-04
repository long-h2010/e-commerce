import { User } from '@/types';
import { Avatar, Card, Divider } from 'antd';

export const UserCard = ({ user }: { user: User }) => {
  const { name, role, avatar, email, phoneNumber } = user;
  return (
    <Card>
      <div className='flex flex-col gap-5'>
        <span className='font-semibold text-[16px] capitalize'>{role}</span>
        <div className='flex gap-2 items-center'>
          <Avatar src={avatar}>{name![0]}</Avatar>
          <div className='flex flex-col'>
            <span className='font-semibold'>{name}</span>
            <div className='flex items-center'>
              <span className='text-gray-500'>{phoneNumber}</span>
              <Divider type='vertical' />
              <span className='text-gray-500'>{email}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
