import { Avatar } from 'antd';

export const UserDisplay = ({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}) => {
  return (
    <div className='flex gap-1 items-center'>
      <Avatar src={avatar} />
      <span>{name}</span>
    </div>
  );
};
