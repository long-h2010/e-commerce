import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  DollarOutlined,
  FireOutlined,
  HomeOutlined,
  RiseOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Area, Bar, Column, Pie } from '@ant-design/charts';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Card,
  Col,
  ConfigProvider,
  Layout,
  List,
  Menu,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  theme,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

// ── Fake data ──────────────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: 'Jan', revenue: 42000000, orders: 210 },
  { month: 'Feb', revenue: 38000000, orders: 190 },
  { month: 'Mar', revenue: 55000000, orders: 275 },
  { month: 'Apr', revenue: 49000000, orders: 245 },
  { month: 'May', revenue: 63000000, orders: 315 },
  { month: 'Jun', revenue: 71000000, orders: 355 },
  { month: 'Jul', revenue: 58000000, orders: 290 },
  { month: 'Aug', revenue: 82000000, orders: 410 },
  { month: 'Sep', revenue: 76000000, orders: 380 },
  { month: 'Oct', revenue: 91000000, orders: 455 },
  { month: 'Nov', revenue: 105000000, orders: 525 },
  { month: 'Dec', revenue: 124000000, orders: 620 },
];

const WEEKLY_DATA = [
  { day: 'Mon', revenue: 8200000,  orders: 41  },
  { day: 'Tue', revenue: 11400000, orders: 57  },
  { day: 'Wed', revenue: 9800000,  orders: 49  },
  { day: 'Thu', revenue: 14200000, orders: 71  },
  { day: 'Fri', revenue: 17600000, orders: 88  },
  { day: 'Sat', revenue: 21000000, orders: 105 },
  { day: 'Sun', revenue: 15800000, orders: 79  },
];

// For Area chart — dual series using G2/AntD format (series column)
const toAreaSeries = (data: typeof MONTHLY_DATA, xKey: string) => [
  ...data.map(d => ({ x: (d as any)[xKey], value: d.revenue,  type: 'Revenue' })),
  ...data.map(d => ({ x: (d as any)[xKey], value: d.orders,   type: 'Orders'  })),
];

const CATEGORY_PIE = [
  { type: 'Tops',        value: 32 },
  { type: 'Bottoms',     value: 24 },
  { type: 'Outerwear',   value: 18 },
  { type: 'Dresses',     value: 14 },
  { type: 'Accessories', value: 8  },
  { type: 'Footwear',    value: 4  },
];

const TOP_PRODUCTS = [
  { id: 1, name: 'Wool Cocoon Coat',       category: 'Outerwear',   sold: 137, revenue: 27126000, emoji: '🧥', trend: 'up'   },
  { id: 2, name: 'Boxy Graphic Tee',       category: 'Tops',        sold: 98,  revenue: 3430000,  emoji: '👕', trend: 'up'   },
  { id: 3, name: 'Barrel Leg Jean',        category: 'Bottoms',     sold: 84,  revenue: 7980000,  emoji: '👖', trend: 'down' },
  { id: 4, name: 'Platform Chelsea Boot',  category: 'Footwear',    sold: 71,  revenue: 10295000, emoji: '👢', trend: 'up'   },
  { id: 5, name: 'Slip Midi Dress',        category: 'Dresses',     sold: 68,  revenue: 6052000,  emoji: '👗', trend: 'up'   },
];

const RECENT_ORDERS = [
  { id: '#ORD-2841', customer: 'Linh Nguyen', amount: 4630000, status: 'shipping',  date: '20 Jun 2025' },
  { id: '#ORD-2840', customer: 'Mai Tran',    amount: 1980000, status: 'delivered', date: '20 Jun 2025' },
  { id: '#ORD-2839', customer: 'An Pham',     amount: 7200000, status: 'confirmed', date: '19 Jun 2025' },
  { id: '#ORD-2838', customer: 'Thu Hoang',   amount: 2450000, status: 'pending',   date: '19 Jun 2025' },
  { id: '#ORD-2837', customer: 'Duc Le',      amount: 890000,  status: 'cancelled', date: '18 Jun 2025' },
];

const LOW_STOCK = [
  { name: 'Ribbed Turtleneck',   sku: 'TOP-003', stock: 0,  emoji: '🧶' },
  { name: 'Quilted Puffer Vest', sku: 'OUT-010', stock: 0,  emoji: '🦺' },
  { name: 'Barrel Leg Jean',     sku: 'BOT-008', stock: 3,  emoji: '👖' },
  { name: 'Chelsea Boot',        sku: 'FTW-007', stock: 8,  emoji: '👢' },
  { name: 'Blazer-Dress',        sku: 'DRS-014', stock: 6,  emoji: '🥻' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const shortenVND = (v: number) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(0)}M`;
  return `${(v / 1_000).toFixed(0)}K`;
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending:   'gold',
  confirmed: 'blue',
  shipping:  'cyan',
  delivered: 'green',
  cancelled: 'red',
};

const PIE_COLORS = ['#1d1d1d','#4a5568','#718096','#a0aec0','#cbd5e0','#e2e8f0'];

const AVATAR_COLORS = ['#1d1d1d','#2c3e50','#3d3530','#4a5568','#3d5a80'];

const NAV_ITEMS = [
  { key: 'home',     icon: <HomeOutlined />,     label: 'Dashboard' },
  { key: 'products', icon: <ShoppingOutlined />, label: 'Products'  },
  { key: 'orders',   icon: <AppstoreOutlined />, label: 'Orders'    },
  { key: 'users',    icon: <UserOutlined />,      label: 'Users'     },
  { key: 'colors',   icon: <BgColorsOutlined />, label: 'Colors'    },
  { key: 'cats',     icon: <TagsOutlined />,      label: 'Categories'},
  { key: 'stats',    icon: <BarChartOutlined />, label: 'Analytics' },
  { key: 'settings', icon: <SettingOutlined />,  label: 'Settings'  },
];

const productColumns: ColumnsType<typeof TOP_PRODUCTS[0]> = [
  {
    title: '#',
    width: 28,
    render: (_: any, __: any, i: number) => (
      <Text type="secondary" style={{ fontSize: 12 }}>{i + 1}</Text>
    ),
  },
  {
    title: 'Product',
    render: (_: any, r: any) => (
      <Space>
        <Avatar size={32} shape="square" style={{ background: '#f5f5f5', fontSize: 18 }}>{r.emoji}</Avatar>
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.category}</Text>
        </Space>
      </Space>
    ),
  },
  {
    title: 'Sold',
    dataIndex: 'sold',
    width: 60,
    render: (v: number) => <Text strong>{v}</Text>,
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    width: 130,
    render: (v: number) => <Text strong style={{ fontSize: 13 }}>{formatVND(v)}</Text>,
  },
  {
    title: '',
    width: 40,
    render: (_: any, r: any) => r.trend === 'up'
      ? <ArrowUpOutlined style={{ color: '#52c41a' }} />
      : <ArrowDownOutlined style={{ color: '#ff4d4f' }} />,
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Temp() {
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');

  const rawData   = period === 'monthly' ? MONTHLY_DATA : WEEKLY_DATA;
  const xKey      = period === 'monthly' ? 'month' : 'day';
  const areaSeries = toAreaSeries(rawData, xKey);

  const totalRevenue  = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders   = MONTHLY_DATA.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // ── Chart configs ──
  const areaConfig = {
    data: areaSeries,
    xField: 'x',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    height: 240,
    color: ['#1d1d1d', '#1677ff'],
    areaStyle: { fillOpacity: 0.08 },
    legend: { position: 'top-right' as const },
    xAxis: { grid: null, line: null, label: { style: { fill: '#aaa', fontSize: 11 } } },
    yAxis: {
      label: {
        formatter: (v: string) => {
          const n = Number(v);
          return n > 1000 ? shortenVND(n) : v;
        },
        style: { fill: '#aaa', fontSize: 11 },
      },
      grid: { line: { style: { stroke: '#f0f0f0' } } },
    },
    tooltip: {
      formatter: (d: any) => ({
        name:  d.type,
        value: d.type === 'Revenue' ? `${shortenVND(d.value)} ₫` : d.value,
      }),
    },
    animation: { appear: { animation: 'wave-in', duration: 600 } },
  };

  const columnConfig = {
    data: WEEKLY_DATA,
    xField: 'day',
    yField: 'orders',
    height: 200,
    color: ({ day }: any) => day === 'Sat' ? '#1d1d1d' : '#e0e0e0',
    columnStyle: { radius: [4, 4, 0, 0] },
    label: { position: 'top' as const, style: { fill: '#aaa', fontSize: 11 } },
    xAxis: { line: null, label: { style: { fill: '#aaa', fontSize: 12 } } },
    yAxis: {
      grid: { line: { style: { stroke: '#f0f0f0' } } },
      label: { style: { fill: '#aaa', fontSize: 11 } },
    },
    tooltip: { formatter: (d: any) => ({ name: 'Orders', value: d.orders }) },
    animation: { appear: { animation: 'grow-in-y', duration: 500 } },
  };

  const pieConfig = {
    data: CATEGORY_PIE,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.65,
    height: 180,
    color: PIE_COLORS,
    label: false as const,
    legend: false as const,
    statistic: {
      title: false as const,
      content: {
        style: { fontSize: '14px', fontWeight: 600, color: '#1d1d1d' },
        content: 'Category',
      },
    },
    tooltip: { formatter: (d: any) => ({ name: d.type, value: `${d.value}%` }) },
    animation: { appear: { animation: 'wave-in', duration: 600 } },
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1d1d1d',
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
        },
        components: {
          Menu:  { itemSelectedBg: '#f5f5f5', itemSelectedColor: '#1d1d1d' },
          Table: { headerBg: '#fafafa' },
        },
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <Layout style={{ minHeight: '100vh' }}>

        {/* Sider */}
        <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f5f5f5' }}>
            <Space>
              <Avatar size={32} style={{ background: '#1d1d1d', fontWeight: 700, fontSize: 13 }}>É</Avatar>
              <Text strong style={{ fontSize: 15 }}>Éclat Studio</Text>
            </Space>
          </div>
          <Menu mode="inline" defaultSelectedKeys={['home']} style={{ border: 'none', marginTop: 8 }} items={NAV_ITEMS} />
        </Sider>

        <Layout>
          {/* Header */}
          <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <BarChartOutlined style={{ fontSize: 18, color: '#888' }} />
              <Breadcrumb items={[{ title: 'Éclat Studio' }, { title: 'Dashboard' }]} />
            </Space>
            <Space>
              <Text type="secondary" style={{ fontSize: 13 }}>Jun 20, 2025</Text>
              <Avatar size={32} style={{ background: '#1d1d1d', fontSize: 12 }}>AD</Avatar>
            </Space>
          </Header>

          <Content style={{ padding: 24, background: '#f8f8f7' }}>

            {/* KPI strip */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              {[
                { title: 'Total Revenue',    value: shortenVND(totalRevenue) + ' ₫', icon: <DollarOutlined />,      color: '#52c41a', bg: '#f6ffed', change: '+18.4%', up: true  },
                { title: 'Total Orders',     value: totalOrders.toLocaleString(),    icon: <ShoppingCartOutlined />, color: '#1677ff', bg: '#e6f4ff', change: '+12.1%', up: true  },
                { title: 'Avg. Order Value', value: shortenVND(avgOrderValue) + ' ₫',icon: <RiseOutlined />,         color: '#fa8c16', bg: '#fff7e6', change: '+5.3%',  up: true  },
                { title: 'Active Sales',     value: '3',                             icon: <FireOutlined />,         color: '#ff4d4f', bg: '#fff2f0', change: '-1',      up: false },
              ].map(s => (
                <Col span={6} key={s.title}>
                  <Card bordered={false} style={{ borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>{s.title}</Text>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1d', lineHeight: 1.1 }}>{s.value}</div>
                        <Space size={4} style={{ marginTop: 6 }}>
                          {s.up
                            ? <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 11 }} />
                            : <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 11 }} />}
                          <Text style={{ fontSize: 12, color: s.up ? '#52c41a' : '#ff4d4f' }}>{s.change} vs last year</Text>
                        </Space>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: s.color }}>
                        {s.icon}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Area + Pie */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={17}>
                <Card
                  bordered={false}
                  style={{ borderRadius: 10 }}
                  title={<Text strong>Revenue & Orders</Text>}
                  extra={
                    <Select size="small" value={period} onChange={v => setPeriod(v)} style={{ width: 110 }}>
                      <Select.Option value="monthly">Monthly</Select.Option>
                      <Select.Option value="weekly">This Week</Select.Option>
                    </Select>
                  }
                >
                  <Area {...areaConfig} />
                </Card>
              </Col>

              <Col span={7}>
                <Card bordered={false} style={{ borderRadius: 10, height: '100%' }} title={<Text strong>Sales by Category</Text>}>
                  <Pie {...pieConfig} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
                    {CATEGORY_PIE.map((c, i) => (
                      <div key={c.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size={6}>
                          <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i], display: 'inline-block' }} />
                          <Text style={{ fontSize: 12 }}>{c.type}</Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>{c.value}%</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Column + Recent orders */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={10}>
                <Card bordered={false} style={{ borderRadius: 10 }} title={<Text strong>Daily Orders — This Week</Text>}>
                  <Column {...columnConfig} />
                </Card>
              </Col>

              <Col span={14}>
                <Card
                  bordered={false}
                  style={{ borderRadius: 10 }}
                  title={<Text strong>Recent Orders</Text>}
                  extra={<Text type="secondary" style={{ fontSize: 12, cursor: 'pointer' }}>View all →</Text>}
                >
                  <List
                    dataSource={RECENT_ORDERS}
                    split={false}
                    renderItem={(order, i) => (
                      <List.Item style={{ padding: '8px 0', borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Space>
                            <Avatar size={32} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], fontSize: 12 }}>
                              {order.customer.split(' ').map(w => w[0]).slice(-2).join('')}
                            </Avatar>
                            <div>
                              <Text strong style={{ fontSize: 13 }}>{order.customer}</Text>
                              <div>
                                <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>{order.id}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}> · {order.date}</Text>
                              </div>
                            </div>
                          </Space>
                          <Space direction="vertical" size={2} style={{ alignItems: 'flex-end' }}>
                            <Text strong style={{ fontSize: 13 }}>{formatVND(order.amount)}</Text>
                            <Tag color={ORDER_STATUS_COLOR[order.status]} style={{ fontSize: 11, margin: 0 }}>
                              {order.status}
                            </Tag>
                          </Space>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            {/* Top products + Low stock */}
            <Row gutter={16}>
              <Col span={14}>
                <Card
                  bordered={false}
                  style={{ borderRadius: 10 }}
                  title={<Text strong>Top Products</Text>}
                  extra={<Text type="secondary" style={{ fontSize: 12, cursor: 'pointer' }}>View all →</Text>}
                >
                  <Table columns={productColumns} dataSource={TOP_PRODUCTS} rowKey="id" pagination={false} size="small" />
                </Card>
              </Col>

              <Col span={10}>
                <Card
                  bordered={false}
                  style={{ borderRadius: 10, height: '100%' }}
                  title={
                    <Space>
                      <Text strong>Low Stock Alert</Text>
                      <Badge count={LOW_STOCK.filter(p => p.stock === 0).length} style={{ backgroundColor: '#ff4d4f' }} />
                    </Space>
                  }
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {LOW_STOCK.map(p => (
                      <div key={p.sku}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <Space>
                            <span style={{ fontSize: 18 }}>{p.emoji}</span>
                            <div>
                              <Text style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</Text>
                              <div><Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{p.sku}</Text></div>
                            </div>
                          </Space>
                          <Text strong style={{ fontSize: 13, color: p.stock === 0 ? '#ff4d4f' : p.stock <= 5 ? '#fa8c16' : '#52c41a' }}>
                            {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                          </Text>
                        </div>
                        <Progress
                          percent={p.stock === 0 ? 0 : Math.min((p.stock / 50) * 100, 100)}
                          showInfo={false}
                          size="small"
                          strokeColor={p.stock === 0 ? '#ff4d4f' : p.stock <= 5 ? '#fa8c16' : '#52c41a'}
                          trailColor="#f0f0f0"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>

          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
