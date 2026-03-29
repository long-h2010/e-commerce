import { StarFilled } from '@ant-design/icons';
import { Progress } from 'antd';

export const StarProcess = ({
  star,
  percent,
}: {
  star: number;
  percent: number;
}) => {
  return (
    <div className='flex gap-2'>
      <p>{star}</p>
      <StarFilled style={{ color: '#f4a261' }} />
      <Progress percent={percent} strokeColor={'#f4a261'} />
    </div>
  );
};
