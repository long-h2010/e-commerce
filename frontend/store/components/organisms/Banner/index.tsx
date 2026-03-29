import { Image } from 'antd';
import { useTranslations } from 'next-intl';

export const Banner = () => {
  const t = useTranslations('home');

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex gap-4'>
        <div className='flex flex-col my-auto px-[100px] gap-4 w-2/3'>
          <p className='text-[10px] uppercase font-black text-stone-400 '>
            {t('welcome')}
          </p>
          <h1 className='text-7xl text-brand font-display italic'>
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className='text-sm font-light text-stone-500 leading-relaxed'>
            {t('title')}
          </p>
        </div>
        <Image
          className='w-1/3'
          alt='basic'
          src='/images/banner.png'
          preview={{ open: false }}
        />
      </div>
    </div>
  );
};
