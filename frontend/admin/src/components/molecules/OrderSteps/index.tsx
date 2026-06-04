import { OrderStatus } from '@/types';
import { Card, Steps } from 'antd';

const ORDER_STATUS_STEPS: OrderStatus[] = [
  'confirmed',
  'shipping',
  'delivered',
];

const ORDER_STATUS_MAP: Record<
  OrderStatus,
  {
    color: string;
    label: string;
  }
> = {
  pending: { color: 'gold', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  shipping: { color: 'cyan', label: 'Shipping' },
  delivered: { color: 'green', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
};

export const OrderSteps = ({ status }: { status: OrderStatus }) => {
  const isCancelled = status === 'cancelled';
  const isPending = status === 'pending';

  const currentStep = isCancelled ? 0 : ORDER_STATUS_STEPS.indexOf(status);

  return (
    <Card>
      <Steps
        size='small'
        current={currentStep}
        items={ORDER_STATUS_STEPS.map((step, index) => {
          const stepIndex = ORDER_STATUS_STEPS.indexOf(status);

          let stepStatus: 'wait' | 'process' | 'finish' | 'error' = 'wait';

          if (isPending && index == 0) stepStatus = 'process';
          else if (isCancelled) stepStatus = index === 0 ? 'error' : 'wait';
          else if (index <= stepIndex) stepStatus = 'finish';

          return {
            title: ORDER_STATUS_MAP[step].label,
            status: stepStatus,
          };
        })}
      />
    </Card>
  );
};
