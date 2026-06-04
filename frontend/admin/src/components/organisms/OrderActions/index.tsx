import { OrderStatus } from '@/types';
import { CheckOutlined, StopOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';

export const OrderActions = ({
  status,
  updateStatus,
}: {
  status: OrderStatus;
  updateStatus: (stt: OrderStatus) => void;
}) => {
  return (
    <Card>
      <div className='flex flex-col gap-5'>
        <div className='flex gap-1 items-center'>
          <span className='font-semibold text-[16px]'>Quick Actions</span>
        </div>
        <div className='flex flex-col gap-3'>
          {status !== 'delivered' && status !== 'cancelled' ? (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={() => updateStatus(status)}
              >
                {status == 'pending'
                  ? 'Confirm order'
                  : status == 'confirmed'
                  ? 'Mark as shipped'
                  : 'Mark as delivered'}
              </Button>
              <Button
                icon={<StopOutlined />}
                onClick={() => updateStatus('cancelled')}
              >
                Cancel order
              </Button>
            </>
          ) : status == 'cancelled' ? (
            <Button
              icon={<UndoOutlined />}
              onClick={() => updateStatus('pending')}
            >
              Restore
            </Button>
          ) : (
            <Button
              icon={<UndoOutlined />}
              onClick={() => updateStatus('cancelled')}
            >
              Refund
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
