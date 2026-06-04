import { useState, useMemo } from 'react';
import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  ConfigProvider,
  theme,
  Breadcrumb,
  Table,
  Input,
  Popconfirm,
  Tag,
  Tooltip,
  message,
  Badge,
  Empty,
  Select,
  Drawer,
  Form,
  Switch,
  Divider,
  DatePicker,
  InputNumber,
  Progress,
  Tabs,
  Statistic,
  Alert,
  Segmented,
  Modal,
  Checkbox,
  Transfer,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TransferDirection } from 'antd/es/transfer';
import dayjs, { Dayjs } from 'dayjs';
import {
  AppstoreOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  SettingOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  FireOutlined,
  GiftOutlined,
  PercentageOutlined,
  DollarOutlined,
  CopyOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// ── Types ──────────────────────────────────────────────────────────────────────
type DiscountType = 'percentage' | 'fixed' | 'buy_x_get_y';
type SaleStatus = 'active' | 'scheduled' | 'ended' | 'paused';
type AppliesTo = 'all' | 'categories' | 'products';

interface SaleItem {
  id: number;
  name: string;
  code: string;
  type: DiscountType;
  value: number; // % or fixed $
  buyX?: number;
  getY?: number;
  status: SaleStatus;
  appliesTo: AppliesTo;
  targets: string[]; // category/product names
  minOrder: number;
  usageLimit: number | null;
  usageCount: number;
  startDate: string;
  endDate: string;
  revenue: number;
  orders: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
let nextId = 10;

const STATUS_META: Record<
  SaleStatus,
  { color: string; badge: any; icon: React.ReactNode; label: string }
> = {
  active: {
    color: '#52c41a',
    badge: 'success',
    icon: <CheckCircleOutlined />,
    label: 'Active',
  },
  scheduled: {
    color: '#1677ff',
    badge: 'processing',
    icon: <ClockCircleOutlined />,
    label: 'Scheduled',
  },
  ended: {
    color: '#aaa',
    badge: 'default',
    icon: <StopOutlined />,
    label: 'Ended',
  },
  paused: {
    color: '#fa8c16',
    badge: 'warning',
    icon: <PauseCircleOutlined />,
    label: 'Paused',
  },
};

const TYPE_META: Record<
  DiscountType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  percentage: {
    icon: <PercentageOutlined />,
    label: '% Off',
    color: '#d4380d',
  },
  fixed: { icon: <DollarOutlined />, label: 'Fixed Amount', color: '#1677ff' },
  buy_x_get_y: {
    icon: <GiftOutlined />,
    label: 'Buy X Get Y',
    color: '#722ed1',
  },
};

function formatDiscount(item: SaleItem) {
  if (item.type === 'percentage') return `${item.value}% off`;
  if (item.type === 'fixed') return `$${item.value} off`;
  if (item.type === 'buy_x_get_y') return `Buy ${item.buyX} Get ${item.getY}`;
  return '—';
}

function computeStatus(item: SaleItem): SaleStatus {
  const now = dayjs();
  const start = dayjs(item.startDate, 'DD MMM YYYY');
  const end = dayjs(item.endDate, 'DD MMM YYYY');
  if (item.status === 'paused') return 'paused';
  if (now.isBefore(start)) return 'scheduled';
  if (now.isAfter(end)) return 'ended';
  return 'active';
}

// ── Seed data ──────────────────────────────────────────────────────────────────
const SEED: SaleItem[] = [
  {
    id: 1,
    name: 'Summer Clearance',
    code: 'SUMMER30',
    type: 'percentage',
    value: 30,
    status: 'active',
    appliesTo: 'all',
    targets: [],
    minOrder: 0,
    usageLimit: null,
    usageCount: 214,
    startDate: '01 Jun 2025',
    endDate: '31 Jul 2025',
    revenue: 18420,
    orders: 214,
  },
  {
    id: 2,
    name: 'New Member Promo',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    status: 'active',
    appliesTo: 'all',
    targets: [],
    minOrder: 50,
    usageLimit: 500,
    usageCount: 187,
    startDate: '01 Jan 2025',
    endDate: '31 Dec 2025',
    revenue: 9310,
    orders: 187,
  },
  {
    id: 3,
    name: 'Flash Sale — Coats',
    code: 'COAT50',
    type: 'fixed',
    value: 50,
    status: 'active',
    appliesTo: 'categories',
    targets: ['Outerwear'],
    minOrder: 150,
    usageLimit: 100,
    usageCount: 67,
    startDate: '15 Jun 2025',
    endDate: '20 Jun 2025',
    revenue: 5360,
    orders: 67,
  },
  {
    id: 4,
    name: 'Buy 2 Get 1 Free',
    code: 'BUY2GET1',
    type: 'buy_x_get_y',
    value: 0,
    buyX: 2,
    getY: 1,
    status: 'active',
    appliesTo: 'categories',
    targets: ['Tops', 'Dresses'],
    minOrder: 0,
    usageLimit: null,
    usageCount: 43,
    startDate: '10 Jun 2025',
    endDate: '30 Jun 2025',
    revenue: 3870,
    orders: 43,
  },
  {
    id: 5,
    name: 'VIP Weekend',
    code: 'VIP20',
    type: 'percentage',
    value: 20,
    status: 'paused',
    appliesTo: 'all',
    targets: [],
    minOrder: 100,
    usageLimit: 200,
    usageCount: 89,
    startDate: '01 May 2025',
    endDate: '03 May 2025',
    revenue: 7240,
    orders: 89,
  },
  {
    id: 6,
    name: 'Autumn Preview',
    code: 'AUTUMN10',
    type: 'percentage',
    value: 10,
    status: 'scheduled',
    appliesTo: 'categories',
    targets: ['Outerwear', 'Knitwear'],
    minOrder: 0,
    usageLimit: null,
    usageCount: 0,
    startDate: '01 Sep 2025',
    endDate: '30 Sep 2025',
    revenue: 0,
    orders: 0,
  },
  {
    id: 7,
    name: 'End of Season',
    code: 'EOS40',
    type: 'percentage',
    value: 40,
    status: 'ended',
    appliesTo: 'all',
    targets: [],
    minOrder: 0,
    usageLimit: null,
    usageCount: 521,
    startDate: '01 Jan 2025',
    endDate: '28 Feb 2025',
    revenue: 41680,
    orders: 521,
  },
  {
    id: 8,
    name: 'Accessories $5 Off',
    code: 'ACC5',
    type: 'fixed',
    value: 5,
    status: 'ended',
    appliesTo: 'categories',
    targets: ['Accessories'],
    minOrder: 30,
    usageLimit: 300,
    usageCount: 300,
    startDate: '15 Mar 2025',
    endDate: '15 Apr 2025',
    revenue: 2190,
    orders: 300,
  },
];

const ALL_PRODUCTS = [
  'Wool Cocoon Coat',
  'Linen Oversized Shirt',
  'Slip Midi Dress',
  'Barrel Leg Jean',
  'Platform Chelsea Boot',
  'Structured Tote',
  'Ribbed Turtleneck',
  'Boxy Graphic Tee',
  'Cashmere Scarf',
  'Leather Belt',
];
const ALL_CATEGORIES = [
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Accessories',
  'Footwear',
];

const NAV_ITEMS = [
  { key: 'home', icon: <HomeOutlined />, label: 'Dashboard' },
  { key: 'products', icon: <ShoppingOutlined />, label: 'Products' },
  { key: 'sales', icon: <TagOutlined />, label: 'Sales' },
  { key: 'orders', icon: <AppstoreOutlined />, label: 'Orders' },
  { key: 'stats', icon: <BarChartOutlined />, label: 'Analytics' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
];

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Temp() {
  const [sales, setSales] = useState<SaleItem[]>(SEED);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState<SaleStatus | 'all'>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState<SaleItem | null>(null);
  const [previewItem, setPreview] = useState<SaleItem | null>(null);
  const [form] = Form.useForm();
  const [messageApi, ctx] = message.useMessage();
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [appliesTo, setAppliesTo] = useState<AppliesTo>('all');

  // ── Derived ──
  const withStatus = useMemo(
    () => sales.map((s) => ({ ...s, status: computeStatus(s) })),
    [sales],
  );

  const filtered = useMemo(
    () =>
      withStatus
        .filter((s) => statusFilter === 'all' || s.status === statusFilter)
        .filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase()),
        ),
    [withStatus, statusFilter, search],
  );

  // ── Stats ──
  const active = withStatus.filter((s) => s.status === 'active');
  const totalRev = withStatus.reduce((a, s) => a + s.revenue, 0);
  const totalOrds = withStatus.reduce((a, s) => a + s.orders, 0);

  // ── Actions ──
  const openCreate = () => {
    setEditItem(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'percentage',
      appliesTo: 'all',
      visible: true,
    });
    setDiscountType('percentage');
    setAppliesTo('all');
    setDrawerOpen(true);
  };

  const openEdit = (item: SaleItem) => {
    setEditItem(item);
    form.setFieldsValue({
      ...item,
      dateRange: [
        dayjs(item.startDate, 'DD MMM YYYY'),
        dayjs(item.endDate, 'DD MMM YYYY'),
      ],
    });
    setDiscountType(item.type);
    setAppliesTo(item.appliesTo);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const [start, end] = values.dateRange as [Dayjs, Dayjs];
      const base = {
        name: values.name,
        code: values.code.toUpperCase(),
        type: values.type,
        value: values.value ?? 0,
        buyX: values.buyX,
        getY: values.getY,
        appliesTo: values.appliesTo,
        targets: values.targets ?? [],
        minOrder: values.minOrder ?? 0,
        usageLimit: values.usageLimit ?? null,
        startDate: start.format('DD MMM YYYY'),
        endDate: end.format('DD MMM YYYY'),
        status: 'active' as SaleStatus,
      };
      if (editItem) {
        setSales((prev) =>
          prev.map((s) => (s.id === editItem.id ? { ...s, ...base } : s)),
        );
        messageApi.success('Sale updated.');
      } else {
        const newSale: SaleItem = {
          id: nextId++,
          ...base,
          usageCount: 0,
          revenue: 0,
          orders: 0,
        };
        setSales((prev) => [newSale, ...prev]);
        messageApi.success('Sale created.');
      }
      setDrawerOpen(false);
    });
  };

  const deleteSale = (id: number) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    messageApi.success('Sale deleted.');
  };

  const togglePause = (item: SaleItem) => {
    setSales((prev) =>
      prev.map((s) =>
        s.id === item.id
          ? { ...s, status: s.status === 'paused' ? 'active' : 'paused' }
          : s,
      ),
    );
    messageApi.info(
      item.status === 'paused' ? 'Sale resumed.' : 'Sale paused.',
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    messageApi.success(`Copied "${code}"`);
  };

  // ── Columns ──
  const columns: ColumnsType<SaleItem> = [
    {
      title: 'Sale',
      render: (_, r) => (
        <Space direction='vertical' size={2}>
          <Space>
            <Text strong style={{ fontSize: 14 }}>
              {r.name}
            </Text>
            {r.usageLimit && r.usageCount >= r.usageLimit && (
              <Tag color='red' style={{ fontSize: 10 }}>
                Limit reached
              </Tag>
            )}
          </Space>
          <Space size={6}>
            <Tag
              icon={TYPE_META[r.type].icon}
              style={{
                fontSize: 11,
                color: TYPE_META[r.type].color,
                background: `${TYPE_META[r.type].color}14`,
                border: `1px solid ${TYPE_META[r.type].color}30`,
              }}
            >
              {formatDiscount(r)}
            </Tag>
            <Tooltip title='Copy code'>
              <Tag
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  cursor: 'pointer',
                  letterSpacing: '.06em',
                }}
                icon={<CopyOutlined />}
                onClick={() => copyCode(r.code)}
              >
                {r.code}
              </Tag>
            </Tooltip>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      render: (status: SaleStatus) => (
        <Badge
          status={STATUS_META[status].badge}
          text={
            <Text
              style={{
                fontSize: 13,
                color: STATUS_META[status].color,
                fontWeight: 500,
              }}
            >
              {STATUS_META[status].label}
            </Text>
          }
        />
      ),
    },
    {
      title: 'Period',
      width: 190,
      render: (_, r) => {
        const start = dayjs(r.startDate, 'DD MMM YYYY');
        const end = dayjs(r.endDate, 'DD MMM YYYY');
        const now = dayjs();
        const total = end.diff(start, 'day') || 1;
        const elapsed = Math.min(Math.max(now.diff(start, 'day'), 0), total);
        const pct = Math.round((elapsed / total) * 100);
        return (
          <Space direction='vertical' size={4} style={{ width: '100%' }}>
            <Text style={{ fontSize: 12, color: '#888' }}>
              {r.startDate} → {r.endDate}
            </Text>
            {r.status === 'active' && (
              <Progress
                percent={pct}
                size='small'
                showInfo={false}
                strokeColor='#1d1d1d'
              />
            )}
          </Space>
        );
      },
    },
    {
      title: 'Applies To',
      width: 160,
      render: (_, r) => (
        <Space size={4} wrap>
          {r.appliesTo === 'all' ? (
            <Tag>All Products</Tag>
          ) : (
            r.targets.map((t) => <Tag key={t}>{t}</Tag>)
          )}
        </Space>
      ),
    },
    {
      title: 'Min. Order',
      dataIndex: 'minOrder',
      width: 100,
      render: (v: number) =>
        v > 0 ? <Text>${v}</Text> : <Text type='secondary'>—</Text>,
    },
    {
      title: 'Usage',
      width: 120,
      render: (_, r) => (
        <Space direction='vertical' size={2}>
          <Text style={{ fontSize: 13 }}>
            {r.usageCount.toLocaleString()}
            {r.usageLimit ? (
              <Text type='secondary'> / {r.usageLimit}</Text>
            ) : (
              ''
            )}
          </Text>
          {r.usageLimit && (
            <Progress
              percent={Math.round((r.usageCount / r.usageLimit) * 100)}
              size='small'
              showInfo={false}
              strokeColor={r.usageCount >= r.usageLimit ? '#ff4d4f' : '#52c41a'}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      width: 100,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v: number) => <Text strong>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Action',
      width: 130,
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title='Preview'>
            <Button
              type='text'
              size='small'
              icon={<EyeOutlined />}
              onClick={() => setPreview(r)}
            />
          </Tooltip>
          <Tooltip title='Edit'>
            <Button
              type='text'
              size='small'
              icon={<EditOutlined />}
              onClick={() => openEdit(r)}
            />
          </Tooltip>
          <Tooltip title={r.status === 'paused' ? 'Resume' : 'Pause'}>
            <Button
              type='text'
              size='small'
              icon={
                r.status === 'paused' ? (
                  <CheckCircleOutlined />
                ) : (
                  <PauseCircleOutlined />
                )
              }
              onClick={() => togglePause(r)}
              disabled={r.status === 'ended'}
            />
          </Tooltip>
          <Popconfirm
            title={`Delete "${r.name}"?`}
            okText='Delete'
            cancelText='No'
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteSale(r.id)}
          >
            <Button type='text' size='small' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
          Menu: { itemSelectedBg: '#f5f5f5', itemSelectedColor: '#1d1d1d' },
          Table: { headerBg: '#fafafa' },
          Tabs: { inkBarColor: '#1d1d1d', itemSelectedColor: '#1d1d1d' },
        },
      }}
    >
      {ctx}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <Layout style={{ minHeight: '100vh' }}>
        {/* Sider */}
        <Sider
          width={220}
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
        >
          <div
            style={{
              padding: '20px 20px 16px',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <Space>
              <Avatar
                size={32}
                style={{ background: '#1d1d1d', fontWeight: 700, fontSize: 13 }}
              >
                É
              </Avatar>
              <Text strong style={{ fontSize: 15 }}>
                Éclat Studio
              </Text>
            </Space>
          </div>
          <Menu
            mode='inline'
            defaultSelectedKeys={['sales']}
            style={{ border: 'none', marginTop: 8 }}
            items={NAV_ITEMS}
          />
        </Sider>

        <Layout>
          {/* Header */}
          <Header
            style={{
              background: '#fff',
              padding: '0 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <TagOutlined style={{ fontSize: 18, color: '#888' }} />
              <Breadcrumb
                items={[{ title: 'Marketing' }, { title: 'Sales & Discounts' }]}
              />
            </Space>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={openCreate}
              style={{ background: '#1d1d1d', borderColor: '#1d1d1d' }}
            >
              New Sale
            </Button>
          </Header>

          <Content style={{ padding: 24, background: '#f8f8f7' }}>
            {/* KPI strip */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              {[
                {
                  icon: <FireOutlined style={{ color: '#ff4d4f' }} />,
                  label: 'Active Sales',
                  value: active.length,
                  color: '#1d1d1d',
                },
                {
                  icon: <ThunderboltOutlined style={{ color: '#fa8c16' }} />,
                  label: 'Total Usages',
                  value: totalOrds.toLocaleString(),
                  color: '#1d1d1d',
                  isStr: true,
                },
                {
                  icon: <DollarOutlined style={{ color: '#52c41a' }} />,
                  label: 'Revenue via Sales',
                  value: `$${totalRev.toLocaleString()}`,
                  color: '#52c41a',
                  isStr: true,
                },
                {
                  icon: <GiftOutlined style={{ color: '#722ed1' }} />,
                  label: 'Total Campaigns',
                  value: sales.length,
                  color: '#1d1d1d',
                },
              ].map((s) => (
                <Col span={6} key={s.label}>
                  <Card bordered={false} style={{ borderRadius: 10 }}>
                    <Space direction='vertical' size={4}>
                      <div style={{ fontSize: 20 }}>{s.icon}</div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: s.color,
                        }}
                      >
                        {s.value}
                      </div>
                      <Text type='secondary' style={{ fontSize: 12 }}>
                        {s.label}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Active sales highlight */}
            {active.length > 0 && (
              <Card
                bordered={false}
                style={{
                  borderRadius: 10,
                  marginBottom: 16,
                  background: '#fffbe6',
                  border: '1px solid #ffe58f',
                }}
              >
                <Row align='middle' gutter={16}>
                  <Col>
                    <FireOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                  </Col>
                  <Col flex='1'>
                    <Text strong>
                      {active.length} sale{active.length > 1 ? 's' : ''}{' '}
                      currently running
                    </Text>
                    <div>
                      <Space size={8} wrap>
                        {active.map((s) => (
                          <Tag
                            key={s.id}
                            color='orange'
                            style={{
                              fontFamily: 'monospace',
                              letterSpacing: '.04em',
                            }}
                          >
                            {s.code} — {formatDiscount(s)}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Table card */}
            <Card bordered={false} style={{ borderRadius: 10 }}>
              {/* Toolbar */}
              <Row
                justify='space-between'
                align='middle'
                style={{ marginBottom: 16 }}
              >
                <Space>
                  <Segmented
                    value={statusFilter}
                    onChange={(v) => setStatus(v as SaleStatus | 'all')}
                    options={[
                      { label: 'All', value: 'all' },
                      {
                        label: (
                          <Space size={4}>
                            <CheckCircleOutlined />
                            Active
                          </Space>
                        ),
                        value: 'active',
                      },
                      {
                        label: (
                          <Space size={4}>
                            <ClockCircleOutlined />
                            Scheduled
                          </Space>
                        ),
                        value: 'scheduled',
                      },
                      {
                        label: (
                          <Space size={4}>
                            <PauseCircleOutlined />
                            Paused
                          </Space>
                        ),
                        value: 'paused',
                      },
                      {
                        label: (
                          <Space size={4}>
                            <StopOutlined />
                            Ended
                          </Space>
                        ),
                        value: 'ended',
                      },
                    ]}
                  />
                </Space>
                <Input
                  prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                  placeholder='Search name or code…'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  style={{ width: 240 }}
                  size='small'
                />
              </Row>

              <Table
                columns={columns}
                dataSource={filtered}
                rowKey='id'
                size='middle'
                pagination={{
                  pageSize: 8,
                  showTotal: (t) => `${t} sales`,
                  showSizeChanger: false,
                }}
                locale={{
                  emptyText: (
                    <Empty
                      description={<Text type='secondary'>No sales found</Text>}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>

      {/* ── Create / Edit Drawer ── */}
      <Drawer
        title={
          <Space>
            <TagOutlined />
            {editItem ? 'Edit Sale' : 'Create New Sale'}
          </Space>
        }
        width={520}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              type='primary'
              onClick={handleSave}
              style={{ background: '#1d1d1d', borderColor: '#1d1d1d' }}
            >
              {editItem ? 'Save Changes' : 'Create Sale'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout='vertical'
          initialValues={{ type: 'percentage', appliesTo: 'all' }}
        >
          {/* Name + Code */}
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item
                name='name'
                label={<Text strong>Sale Name</Text>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder='e.g. Summer Clearance' />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name='code'
                label={<Text strong>Discount Code</Text>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input
                  placeholder='e.g. SUMMER30'
                  style={{
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Discount type */}
          <Form.Item name='type' label={<Text strong>Discount Type</Text>}>
            <Segmented
              block
              options={[
                {
                  label: (
                    <Space>
                      <PercentageOutlined />
                      Percentage
                    </Space>
                  ),
                  value: 'percentage',
                },
                {
                  label: (
                    <Space>
                      <DollarOutlined />
                      Fixed Amount
                    </Space>
                  ),
                  value: 'fixed',
                },
                {
                  label: (
                    <Space>
                      <GiftOutlined />
                      Buy X Get Y
                    </Space>
                  ),
                  value: 'buy_x_get_y',
                },
              ]}
              onChange={(v) => {
                setDiscountType(v as DiscountType);
              }}
            />
          </Form.Item>

          {/* Discount value */}
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const t = getFieldValue('type') as DiscountType;
              if (t === 'percentage')
                return (
                  <Form.Item
                    name='value'
                    label='Discount %'
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      suffix='%'
                      style={{ width: '100%' }}
                      placeholder='e.g. 30'
                    />
                  </Form.Item>
                );
              if (t === 'fixed')
                return (
                  <Form.Item
                    name='value'
                    label='Discount Amount'
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <InputNumber
                      min={1}
                      prefix='$'
                      style={{ width: '100%' }}
                      placeholder='e.g. 50'
                    />
                  </Form.Item>
                );
              return (
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name='buyX'
                      label='Buy (quantity)'
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        placeholder='2'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='getY'
                      label='Get (quantity free)'
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        placeholder='1'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              );
            }}
          </Form.Item>

          <Divider />

          {/* Applies to */}
          <Form.Item name='appliesTo' label={<Text strong>Applies To</Text>}>
            <Select
              onChange={(v: AppliesTo) => {
                setAppliesTo(v);
                form.setFieldValue('targets', []);
              }}
            >
              <Select.Option value='all'>All Products</Select.Option>
              <Select.Option value='categories'>
                Specific Categories
              </Select.Option>
              <Select.Option value='products'>Specific Products</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const at = getFieldValue('appliesTo');
              if (at === 'categories')
                return (
                  <Form.Item
                    name='targets'
                    label='Categories'
                    rules={[{ required: true, message: 'Select at least one' }]}
                  >
                    <Select mode='multiple' placeholder='Select categories…'>
                      {ALL_CATEGORIES.map((c) => (
                        <Select.Option key={c} value={c}>
                          {c}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              if (at === 'products')
                return (
                  <Form.Item
                    name='targets'
                    label='Products'
                    rules={[{ required: true, message: 'Select at least one' }]}
                  >
                    <Select mode='multiple' placeholder='Select products…'>
                      {ALL_PRODUCTS.map((p) => (
                        <Select.Option key={p} value={p}>
                          {p}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              return null;
            }}
          </Form.Item>

          <Divider />

          {/* Date range */}
          <Form.Item
            name='dateRange'
            label={<Text strong>Sale Period</Text>}
            rules={[{ required: true, message: 'Select date range' }]}
          >
            <RangePicker style={{ width: '100%' }} format='DD MMM YYYY' />
          </Form.Item>

          {/* Min order + usage */}
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name='minOrder' label='Min. Order Value ($)'>
                <InputNumber
                  min={0}
                  prefix='$'
                  style={{ width: '100%' }}
                  placeholder='0 = no minimum'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='usageLimit' label='Usage Limit'>
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder='Leave empty = unlimited'
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Live preview */}
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const t = getFieldValue('type');
              const val = getFieldValue('value');
              const buyX = getFieldValue('buyX');
              const getY = getFieldValue('getY');
              const code = getFieldValue('code') || 'YOURCODE';
              const min = getFieldValue('minOrder');
              const limit = getFieldValue('usageLimit');
              let preview = '';
              if (t === 'percentage' && val) preview = `${val}% off`;
              else if (t === 'fixed' && val) preview = `$${val} off`;
              else if (t === 'buy_x_get_y' && buyX && getY)
                preview = `Buy ${buyX} Get ${getY} Free`;
              if (!preview) return null;
              return (
                <Alert
                  type='info'
                  style={{ borderRadius: 8 }}
                  message={
                    <Space direction='vertical' size={2}>
                      <Text
                        strong
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 14,
                          letterSpacing: '.06em',
                        }}
                      >
                        {code.toUpperCase()}
                      </Text>
                      <Text>
                        {preview}
                        {min ? ` on orders over $${min}` : ''}
                      </Text>
                      {limit && (
                        <Text type='secondary' style={{ fontSize: 12 }}>
                          Limited to {limit} uses
                        </Text>
                      )}
                    </Space>
                  }
                />
              );
            }}
          </Form.Item>
        </Form>
      </Drawer>

      {/* ── Preview Modal ── */}
      <Modal
        open={!!previewItem}
        onCancel={() => setPreview(null)}
        footer={
          <Space>
            <Button
              onClick={() => {
                if (previewItem) {
                  openEdit(previewItem);
                  setPreview(null);
                }
              }}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Button
              type='primary'
              onClick={() => setPreview(null)}
              style={{ background: '#1d1d1d', borderColor: '#1d1d1d' }}
            >
              Close
            </Button>
          </Space>
        }
        title={previewItem?.name}
        width={480}
      >
        {previewItem && (
          <Space direction='vertical' size={16} style={{ width: '100%' }}>
            {/* Code badge */}
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                background: '#f8f8f7',
                borderRadius: 10,
                border: '2px dashed #e0e0e0',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  marginBottom: 8,
                }}
              >
                Discount Code
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  letterSpacing: '.1em',
                  color: '#1d1d1d',
                }}
              >
                {previewItem.code}
              </div>
              <div style={{ marginTop: 8 }}>
                <Tag
                  style={{
                    fontSize: 14,
                    padding: '4px 14px',
                    color: TYPE_META[previewItem.type].color,
                    background: `${TYPE_META[previewItem.type].color}18`,
                    border: `1px solid ${TYPE_META[previewItem.type].color}40`,
                  }}
                >
                  {formatDiscount(previewItem)}
                </Tag>
              </div>
            </div>

            {/* Stats */}
            <Row gutter={12}>
              {[
                { label: 'Usages', value: previewItem.usageCount },
                {
                  label: 'Revenue',
                  value: `$${previewItem.revenue.toLocaleString()}`,
                },
                { label: 'Orders', value: previewItem.orders },
              ].map((s) => (
                <Col span={8} key={s.label}>
                  <Card
                    bordered={false}
                    style={{
                      textAlign: 'center',
                      background: '#fafafa',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {s.value}
                    </div>
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {s.label}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Details */}
            <table
              style={{
                width: '100%',
                fontSize: 13,
                borderCollapse: 'collapse',
              }}
            >
              {[
                [
                  'Status',
                  <Badge
                    status={STATUS_META[computeStatus(previewItem)].badge}
                    text={STATUS_META[computeStatus(previewItem)].label}
                  />,
                ],
                ['Period', `${previewItem.startDate} → ${previewItem.endDate}`],
                [
                  'Applies To',
                  previewItem.appliesTo === 'all'
                    ? 'All Products'
                    : previewItem.targets.join(', '),
                ],
                [
                  'Min. Order',
                  previewItem.minOrder > 0
                    ? `$${previewItem.minOrder}`
                    : 'No minimum',
                ],
                [
                  'Usage Limit',
                  previewItem.usageLimit
                    ? `${previewItem.usageCount} / ${previewItem.usageLimit}`
                    : 'Unlimited',
                ],
              ].map(([k, v]) => (
                <tr
                  key={k as string}
                  style={{ borderBottom: '1px solid #f5f5f5' }}
                >
                  <td style={{ padding: '8px 0', color: '#888', width: '38%' }}>
                    {k}
                  </td>
                  <td style={{ padding: '8px 0', fontWeight: 500 }}>{v}</td>
                </tr>
              ))}
            </table>
          </Space>
        )}
      </Modal>
    </ConfigProvider>
  );
}
