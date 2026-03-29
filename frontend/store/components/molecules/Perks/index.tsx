import { RedoOutlined, SafetyOutlined, TruckOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

export const Perks = () => {
  const t = useTranslations('perk');

  return (
    <div className='flex justify-between gap-4'>
      <div className='flex flex-col w-full items-center p-3'>
        <TruckOutlined />
        <span>{t('free_shipping')}</span>
      </div>
      <div className='flex flex-col w-full items-center p-3'>
        <RedoOutlined />
        <span>{t('returns')}</span>
      </div>
      <div className='flex flex-col w-full items-center p-3'>
        <SafetyOutlined />
        <span>{t('quality')}</span>
      </div>
    </div>
  );
};
