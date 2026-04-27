import { DiscountDisplay } from '@/components/molecules';
import { AddDiscountDrawer } from '@/components/organisms';
import { PageTemplate } from '@/components/templates';
import { useHeaderStore } from '@/stores';
import { Discount, DiscountStatus } from '@/types';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Progress,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { formatVND } from '@/lib/utils';

const STATUS_META = {
  [DiscountStatus.ACTIVE]: { status: 'success', icon: <CheckCircleOutlined /> },
  [DiscountStatus.ENDED]: { status: 'error', icon: <CloseCircleOutlined /> },
  [DiscountStatus.PAUSED]: { status: 'warning', icon: <PauseCircleOutlined /> },
  [DiscountStatus.SCHEDULED]: {
    status: 'processing',
    icon: <ClockCircleOutlined />,
  },
};

export const DiscountList = () => {
  const { setState, clearState } = useHeaderStore();
  const [openAddDiscount, setOpenAddDiscount] = useState<boolean>(false);
  const { tableProps } = useTable<Discount>({
    syncWithLocation: false,
  });

  useEffect(() => {
    setState('Create', 'plus', () => setOpenAddDiscount(true));
    return () => clearState();
  }, []);

  return (
    <PageTemplate>
      <Card>
        <div className='flex gap-20'>
          <Input
            placeholder='Search by name or code'
            prefix={<SearchOutlined />}
            className='max-w-sm'
          />
          <div className='flex items-center gap-3'>
            <span className='uppercase text-xs'>Status: </span>
            <Select placeholder='Status' className='min-w-[120px]' />
          </div>
        </div>
      </Card>

      <Table {...tableProps}>
        <Table.Column
          title='Discount'
          render={(_, record) => (
            <DiscountDisplay
              name={record.name}
              code={record.code}
              type={record.type}
              value={record.value}
            />
          )}
        />
        <Table.Column
          title='Status'
          dataIndex='status'
          render={(value: DiscountStatus) => (
            <Tag
              color={STATUS_META[value].status}
              icon={STATUS_META[value].icon}
              className='capitalize'
            >
              {value}
            </Tag>
          )}
        />
        <Table.Column
          title='Period'
          render={(_, record) => (
            <DatePicker.RangePicker
              disabled
              format='DD/MM/YYYY'
              defaultValue={[dayjs(record.startTime), dayjs(record.endTime)]}
            />
          )}
        />
        <Table.Column
          title='Apply To'
          dataIndex='applyTo'
          render={(value) => <Tag className='capitalize'>{value}</Tag>}
        />
        <Table.Column
          title='Min Order'
          dataIndex='minOrder'
          render={(value) => formatVND(value)}
        />
        <Table.Column
          title='Usage'
          render={(_, record) => (
            <div className='flex flex-col'>
              <span>
                {record.usageCount}
                {record.usageLimit ? '/' + record.usageLimit : ''}
              </span>
              {record.usageLimit && (
                <Progress
                  percent={Math.round(
                    (record.usageCount / record.usageLimit) * 100,
                  )}
                  size='small'
                  showInfo={false}
                  strokeColor={
                    record.usageCount >= record.usageLimit ? 'red' : 'green'
                  }
                />
              )}
            </div>
          )}
        />
        <Table.Column
          align='center'
          render={(_, record) => (
            <Space>
              {record.status == DiscountStatus.ACTIVE ? (
                <Button size='small' icon={<PauseCircleOutlined />} />
              ) : (
                <Button size='small' icon={<PlayCircleOutlined />} disabled={DiscountStatus.PAUSED !== record.status} />
              )}
              <EditButton hideText size='small' recordItemId={record.id} />
              <ShowButton hideText size='small' recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
      <AddDiscountDrawer open={openAddDiscount} setOpen={setOpenAddDiscount} />
    </PageTemplate>
  );
};
