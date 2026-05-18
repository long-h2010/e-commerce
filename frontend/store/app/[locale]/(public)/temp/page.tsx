'use client';

import { MainTemplate } from '@/components/templates';
import { useList } from '@/hooks';
import { calSalePrice } from '@/lib/utils';
import { ProductCart } from '@/types';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Steps,
  Typography,
  Space,
  Tag,
  Image,
} from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  HomeOutlined,
  LockOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

const SHIPPING_FEE = 30000;
const FREE_SHIP_THRESHOLD = 500000;

const STEPS = [
  { title: 'Thông tin', icon: <UserOutlined /> },
  { title: 'Vận chuyển', icon: <HomeOutlined /> },
  { title: 'Thanh toán', icon: <CreditCardOutlined /> },
];

export default function Temp() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [items, setItems] = useState<ProductCart[]>([]);
  const [loading, setLoading] = useState(false);

  const { data } = useList({
    resource: process.env.NEXT_PUBLIC_CARTS_ENDPOINT!,
  });

  useEffect(() => {
    if (!data?.data) return;
    setItems(data.data as ProductCart[]);
  }, [data]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          calSalePrice({ price: item.price, saleValue: item.saleValue ?? 0 }) *
            item.quantity,
        0,
      ),
    [items],
  );

  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const formatPrice = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const handleNext = async () => {
    try {
      await form.validateFields(getFieldsForStep(currentStep));
      setCurrentStep((s) => s + 1);
    } catch {
      // Ant Design shows inline validation errors automatically
    }
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Order submitted:', { ...values, paymentMethod, items, total });
      // TODO: call your order API here
      router.push('/order-success');
    } catch {
      // validation errors shown inline
    } finally {
      setLoading(false);
    }
  };

  const getFieldsForStep = (step: number): string[] => {
    if (step === 0) return ['fullName', 'email', 'phone'];
    if (step === 1) return ['address', 'city', 'district', 'ward'];
    return [];
  };

  /* ─── Step panels ─────────────────────────────────────────── */

  const InformationStep = (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        Thông tin liên hệ
      </Title>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='fullName'
            label='Họ và tên'
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder='Nguyễn Văn A' size='large' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder='example@email.com' size='large' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name='phone'
            label='Số điện thoại'
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^(0|\+84)\d{9}$/, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input placeholder='0901 234 567' size='large' />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name='note' label='Ghi chú đơn hàng (tuỳ chọn)'>
            <Input.TextArea rows={3} placeholder='Ghi chú thêm cho người giao hàng...' />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const ShippingStep = (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        Địa chỉ giao hàng
      </Title>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='address'
            label='Địa chỉ'
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder='Số nhà, tên đường' size='large' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name='city'
            label='Tỉnh / Thành phố'
            rules={[{ required: true, message: 'Vui lòng chọn' }]}
          >
            <Select placeholder='Chọn tỉnh/thành' size='large'>
              <Option value='hcm'>TP. Hồ Chí Minh</Option>
              <Option value='hn'>Hà Nội</Option>
              <Option value='dn'>Đà Nẵng</Option>
              <Option value='other'>Khác</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name='district'
            label='Quận / Huyện'
            rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
          >
            <Input placeholder='Quận 1' size='large' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name='ward'
            label='Phường / Xã'
            rules={[{ required: true, message: 'Vui lòng nhập phường/xã' }]}
          >
            <Input placeholder='Phường Bến Nghé' size='large' />
          </Form.Item>
        </Col>
      </Row>

      <Title level={5} style={{ marginTop: 8, marginBottom: 12 }}>
        Phương thức vận chuyển
      </Title>
      <Form.Item name='shippingMethod' initialValue='standard'>
        <Radio.Group style={{ width: '100%' }}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Radio value='standard'>
              <Space>
                <span>Giao hàng tiêu chuẩn (3–5 ngày)</span>
                {shippingFee === 0 ? (
                  <Tag color='success'>Miễn phí</Tag>
                ) : (
                  <Text type='secondary'>{formatPrice(SHIPPING_FEE)}</Text>
                )}
              </Space>
            </Radio>
            <Radio value='express'>
              <Space>
                <span>Giao hàng nhanh (1–2 ngày)</span>
                <Text type='secondary'>{formatPrice(50000)}</Text>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
    </div>
  );

  const PaymentStep = (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        Phương thức thanh toán
      </Title>
      <Radio.Group
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={{ width: '100%' }}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <Radio value='cod'>
            <Space>
              <DollarOutlined />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </Space>
          </Radio>
          <Radio value='bank'>
            <Space>
              <CreditCardOutlined />
              <span>Chuyển khoản ngân hàng</span>
            </Space>
          </Radio>
        </Space>
      </Radio.Group>

      {paymentMethod === 'bank' && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: '#f5f5f5',
            borderRadius: 8,
            border: '1px dashed #d9d9d9',
          }}
        >
          <Text strong>Thông tin chuyển khoản:</Text>
          <br />
          <Text>
            Ngân hàng: <strong>Vietcombank</strong>
          </Text>
          <br />
          <Text>
            Số tài khoản: <strong>1234 5678 9012</strong>
          </Text>
          <br />
          <Text>
            Chủ tài khoản: <strong>CÔNG TY TNHH XYZ</strong>
          </Text>
          <br />
          <Text type='secondary' style={{ fontSize: 12 }}>
            Nội dung: [Họ tên] + [Số điện thoại]
          </Text>
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          color: '#888',
          fontSize: 12,
        }}
      >
        <LockOutlined />
        <span>Thông tin thanh toán được mã hóa và bảo mật</span>
      </div>
    </div>
  );

  const stepContent = [InformationStep, ShippingStep, PaymentStep];

  /* ─── Order summary sidebar ───────────────────────────────── */

  const OrderSummary = (
    <div
      style={{
        background: '#fafafa',
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        padding: 24,
        position: 'sticky',
        top: 80,
      }}
    >
      <Space style={{ marginBottom: 16 }}>
        <ShoppingCartOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Đơn hàng ({items.length} sản phẩm)
        </Title>
      </Space>

      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
        {items.map((item) => {
          const itemPrice = calSalePrice({
            price: item.price,
            saleValue: item.saleValue ?? 0,
          });
          return (
            <div
              key={item.variantId}
              style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={56}
                  height={56}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                  preview={false}
                  loading='lazy'
                />
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: '#595959',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.quantity}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  ellipsis={{ tooltip: item.name }}
                  style={{ display: 'block', fontWeight: 500, fontSize: 13 }}
                >
                  {item.name}
                </Text>
                {item && (
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    {item.variantId}
                  </Text>
                )}
              </div>
              <Text style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>
                {formatPrice(itemPrice * item.quantity)}
              </Text>
            </div>
          );
        })}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Space direction='vertical' style={{ width: '100%' }} size={8}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type='secondary'>Tạm tính</Text>
          <Text>{formatPrice(subtotal)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type='secondary'>Phí vận chuyển</Text>
          {shippingFee === 0 ? (
            <Tag color='success' style={{ margin: 0 }}>
              Miễn phí
            </Tag>
          ) : (
            <Text>{formatPrice(shippingFee)}</Text>
          )}
        </div>
        {subtotal < FREE_SHIP_THRESHOLD && (
          <Text type='secondary' style={{ fontSize: 12 }}>
            Mua thêm {formatPrice(FREE_SHIP_THRESHOLD - subtotal)} để được miễn phí vận chuyển
          </Text>
        )}
      </Space>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 15 }}>
          Tổng cộng
        </Text>
        <Text strong style={{ fontSize: 18, color: '#cf1322' }}>
          {formatPrice(total)}
        </Text>
      </div>
    </div>
  );

  /* ─── Render ──────────────────────────────────────────────── */

  return (
    <MainTemplate>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            Thanh toán
          </Title>
        </div>

        <Steps
          current={currentStep}
          items={STEPS.map((s) => ({ title: s.title, icon: s.icon }))}
          style={{ maxWidth: 500, margin: '0 auto 40px' }}
        />

        <Row gutter={[32, 32]}>
          {/* Form */}
          <Col xs={24} lg={14}>
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 28,
                border: '1px solid #f0f0f0',
              }}
            >
              <Form form={form} layout='vertical' requiredMark={false} size='large'>
                {stepContent[currentStep]}
              </Form>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 32,
                  paddingTop: 20,
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <Button
                  size='large'
                  onClick={currentStep === 0 ? () => router.back() : handleBack}
                >
                  {currentStep === 0 ? 'Quay lại giỏ hàng' : 'Quay lại'}
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button type='primary' size='large' onClick={handleNext}>
                    Tiếp tục
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    size='large'
                    danger
                    loading={loading}
                    onClick={handleSubmit}
                    style={{ minWidth: 140 }}
                  >
                    Đặt hàng
                  </Button>
                )}
              </div>
            </div>
          </Col>

          {/* Order summary */}
          <Col xs={24} lg={10}>
            {OrderSummary}
          </Col>
        </Row>
      </div>
    </MainTemplate>
  );
}
