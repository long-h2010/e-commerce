import { formatDate } from '@/lib/utils';
import { Card, Divider, Timeline } from 'antd';

export const ProductActivityLog = () => {
  return (
    <Card>
      <span className='text-sm font-bold'>Activity Log</span>
      <Divider />
      <Timeline
        items={[
          {
            color: 'green',
            children: (
              <div className='flex flex-col gap-2'>
                <span>Product published</span>
                <span className='text-xs text-gray-500'>
                  {formatDate('2026-04-04T10:41:03.263Z')}
                </span>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};
