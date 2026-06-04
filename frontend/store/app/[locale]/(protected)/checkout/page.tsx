'use client';

import {
  InformationStep,
  OrderSummary,
  PaymentsStep,
} from '@/components/organisms';
import { MainTemplate } from '@/components/templates';
import { useCreate, useList } from '@/hooks';
import { PaymentMethod, ProductCart } from '@/types';
import { CreditCardOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Steps } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const SHIPPING_FEE = {
  standard: 1000,
  express: 50000,
};

export default function Checkout() {
  const t = useTranslations('checkout');
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<ProductCart[]>([]);
  const [discountId, setDiscountId] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState(SHIPPING_FEE.standard);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('banking');
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [qrCode, setQrCode] = useState<string>();
  const [orderId, setOrderId] = useState<string>();
  const [orderCode, setOrderCode] = useState<string>();
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [transferDetail, setTransferDetail] = useState<string>('');

  const { data } = useList({
    resource: process.env.NEXT_PUBLIC_CARTS_ENDPOINT!,
  });

  const { mutate: createOrder } = useCreate({
    resource: process.env.NEXT_PUBLIC_ORDERS_ENDPOINT!,
  });

  useEffect(() => {
    if (!data?.data) return;
    const mapped: ProductCart[] = data.data;
    setItems(mapped.filter((p) => p.stock > 0));
  }, [data]);

  const handleChangeQuantity = useCallback(
    (variantId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item,
        ),
      );
    },
    [],
  );

  const handleDeleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const STEPS = [
    { title: t('information'), icon: <UserOutlined /> },
    { title: t('payments'), icon: <CreditCardOutlined /> },
  ];

  const getFieldsForStep = (step: number): string[] => {
    if (step === 0)
      return [
        'fullName',
        'email',
        'phone',
        'address',
        'city',
        'district',
        'ward',
        'shippingMethod',
      ];
    if (step === 1) return ['paymentMethod'];
    return [];
  };

  const handleBack = () => {
    setConfirm(false);
    setCurrentStep((s) => s - 1);
  };

  const handleNext = async () => {
    await form.validateFields(getFieldsForStep(currentStep));
    setCurrentStep((s) => s + 1);
  };

  const handleCreateOrder = async () => {
    await form.validateFields(getFieldsForStep(currentStep));

    createOrder(
      {
        ...form.getFieldsValue(),
        items: items,
        discountId: discountId ?? undefined,
      },
      {
        onSuccess: (data: any) => {
          const orderData = data.data;
          setConfirm(true);
          if (orderData.order.paymentMethod == 'banking') {
            setQrCode(orderData.qrCode);
            setOrderId(orderData.order.id);
            setOrderCode(orderData.order.orderCode);
            setOrderTotal(orderData.order.totalAmount);
            setTransferDetail(orderData.description);
          } else {
            router.push(`/orders/${orderData.order.id}`);
          }
        },
      },
    );
  };

  return (
    <MainTemplate>
      <div className='flex flex-col gap-10 px-10'>
        <h1 className='font-semibold uppercase text-brand mx-auto mt-10'>
          {t('payments')}
        </h1>
        <Steps
          current={currentStep}
          items={STEPS.map((s) => ({ title: s.title, icon: s.icon }))}
          className='max-w-[500px] w-full !mx-auto'
        />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          <div className='col-span-1'>
            <Card>
              <Form form={form} className='flex flex-col gap-5'>
                <div
                  className={
                    currentStep === 0 ? 'flex flex-col gap-2' : 'hidden'
                  }
                >
                  <InformationStep
                    SHIPPING_FEE={SHIPPING_FEE}
                    setShippingFee={setShippingFee}
                  />
                </div>
                <div
                  className={
                    currentStep === 1 ? 'flex flex-col gap-2' : 'hidden'
                  }
                >
                  <PaymentsStep
                    confirm={confirm}
                    qrCode={qrCode}
                    orderId={orderId}
                    orderCode={orderCode}
                    amount={total}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    transferDetail={transferDetail}
                  />
                </div>
              </Form>
              <Divider />
              <div className='flex justify-between'>
                {currentStep == 0 && (
                  <>
                    <div></div>
                    <Button type='primary' onClick={handleNext}>
                      {t('next')}
                    </Button>
                  </>
                )}
                {currentStep == 1 && (
                  <>
                    <Button onClick={handleBack}>{t('back')}</Button>
                    {confirm ? (
                      <Button type='primary'>{t('cancel')}</Button>
                    ) : (
                      <Button type='primary' onClick={handleCreateOrder}>
                        {t('confirm')}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
          <div className='col-span-1 sticky top-15 self-start'>
            <OrderSummary
              items={items}
              shippingFee={shippingFee}
              total={total}
              setDiscountId={setDiscountId}
              handleChangeQuantity={handleChangeQuantity}
              handleDeleteItem={handleDeleteItem}
              setTotal={setTotal}
            />
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
