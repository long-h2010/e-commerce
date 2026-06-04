import { PageTemplate } from '@/components/templates';
import { formatNumberCount, formatVND } from '@/lib/utils';
import { Line, Pie } from '@ant-design/charts';
import { useTable } from '@refinedev/antd';
import { useCustom } from '@refinedev/core';
import { Card, Image, Select, Table } from 'antd';
import { useEffect, useState } from 'react';

const toChartData = (data: any, xKey: string) => {
  if (!data || data.length == 0) return [];

  const maxRevenue = Math.max(...data.map((d: any) => d.revenue));
  const maxOrders = Math.max(...data.map((d: any) => d.orders));

  const ratio = Math.floor(maxRevenue / maxOrders);

  return [
    ...data.map((d: any) => ({
      x: d[xKey],
      value: d.revenue,
      valueOriginal: d.revenue,
      category: 'Revenue',
    })),
    ...data.map((d: any) => ({
      x: d[xKey],
      value: d.orders * ratio,
      valueOriginal: d.orders,
      category: 'Orders',
    })),
  ];
};

export const Dashboard = () => {
  const [revenueSelected, setRevenueSelected] = useState<'month' | 'day'>(
    'month',
  );
  const [revenueChartData, setRevenueChartData] = useState([]);
  const { result: overviewResult } = useCustom({
    url: import.meta.env.VITE_DASHBOARD_ENDPOINT,
    method: 'get',
  });

  const { tableProps: topProductsProps } = useTable({
    resource: import.meta.env.VITE_TOP_PRODUCTS_ENDPOINT,
  });
  console.log('overviewResult', topProductsProps.dataSource);

  const data = overviewResult?.data;

  const overviewData = [
    {
      title: 'Total Revenue',
      value: formatVND(data?.revenueOverview?.total) ?? 0,
      suffix: (
        <span
          className={`text-[10px] ml-3 ${
            data?.revenueOverview?.growth >= 0
              ? 'text-green-500'
              : 'text-red-500'
          } `}
        >
          {data?.revenueOverview?.growth >= 0
            ? `↑ ${data?.revenueOverview?.growth}`
            : `↓ ${data?.revenueOverview?.growth}`}
          % vs last month
        </span>
      ),
    },
    {
      title: 'Total Customers',
      value: formatNumberCount(data?.customerOverview?.total) ?? 0,
      suffix: (
        <span
          className={`text-[10px] ml-3 ${
            data?.customerOverview?.growth >= 0
              ? 'text-green-500'
              : 'text-red-500'
          } `}
        >
          {data?.customerOverview?.growth >= 0
            ? `↑ ${data?.customerOverview?.growth}`
            : `↓ ${data?.customerOverview?.growth}`}
          % vs last month
        </span>
      ),
    },
    {
      title: 'Total Orders',
      value: formatNumberCount(data?.orderOverview?.total) ?? 0,
      suffix: (
        <span
          className={`text-[10px] ml-3 ${
            data?.orderOverview?.growth >= 0 ? 'text-green-500' : 'text-red-500'
          } `}
        >
          {data?.orderOverview?.growth >= 0
            ? `↑ ${data?.orderOverview?.growth}`
            : `↓ ${data?.orderOverview?.growth}`}
          % vs last month
        </span>
      ),
    },
    {
      title: 'Active Sales',
      value: formatNumberCount(data?.totalDiscountActive),
    },
  ];

  useEffect(() => {
    if (revenueSelected == 'month') setRevenueChartData(data?.monthlyRevenue);
    else setRevenueChartData(data?.weeklyRevenue);
  }, [revenueSelected, overviewResult.data]);

  const lineConfig = {
    data: toChartData(revenueChartData, revenueSelected),
    xField: 'x',
    yField: 'value',
    colorField: 'category',
    height: 280,
    smooth: true,
    sizeField: 'value',
    shapeField: 'trail',
    legend: { size: false },
    axis: {
      y: false,
    },
    tooltip: {
      items: [
        (datum: any) => ({
          name: datum.category,
          value:
            datum.category === 'Revenue'
              ? formatVND(datum.valueOriginal)
              : `${datum.valueOriginal} orders`,
        }),
      ],
    },
  };

  const pieConfig = {
    data: (data?.productCount ?? []).map((item: any) => ({
      ...item,
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    })),
    angleField: 'productCount',
    colorField: 'category',
    innerRadius: 0.6,
    height: 280,
    tooltip: {
      items: [
        (datum: any) => ({
          name: datum.category,
          value: datum.productCount,
        }),
      ],
    },
  };

  return (
    <PageTemplate overview={overviewData}>
      <div className='grid grid-cols-3 gap-10'>
        <div className='col-span-2'>
          <Card
            title='Revenue & Orders'
            extra={
              <Select
                options={[
                  { label: 'Monthly', value: 'month' },
                  { label: 'Weekly', value: 'day' },
                ]}
                onChange={(value: 'month' | 'day') => setRevenueSelected(value)}
                defaultValue={'month'}
              />
            }
          >
            <Line {...lineConfig} />
          </Card>
        </div>
        <div>
          <Card title='Product count by Category'>
            <Pie {...pieConfig} />
          </Card>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-10'>
        <div className=''>
          <Card title='Top Products'>
            <Table {...topProductsProps}>
              <Table.Column
                dataIndex={'thumbnail'}
                title='Thumbnail'
                render={(value) => <Image src={value} height={32} width={32} />}
              />
              <Table.Column dataIndex={'name'} title='Name' />
              <Table.Column title='Total Sold' dataIndex={'totalSold'} />
              <Table.Column
                title='Total Revenue'
                dataIndex={'totalRevenue'}
                render={(value) => formatVND(value)}
              />
            </Table>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};
