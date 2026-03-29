import { Button, Input } from 'antd';
import { useTranslations } from 'next-intl';

export const NewsLetter = () => {
  const t = useTranslations('newsletter');

  return (
    <section className='py-24 text-center border-t border-stone-100'>
      <p className='text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-3'>
        {t('title')}
      </p>
      <h2 className='font-display text-4xl font-light mb-3'>
        <span className='italic'>{t('offer')}</span>
      </h2>
      <p className='text-sm text-stone-400 mb-9'>{t('gift')}</p>
      <div className='flex max-w-md mx-auto'>
        <Input
          className='!rounded-none flex-1 !px-5 !py-2 border border-stone-200 border-r-0 text-sm outline-none'
          placeholder={t('email')}
        />
        <Button
          type='primary'
          size='large'
          className='!rounded-none !px-5 !text-[10px] tracking-widest uppercase'
        >
          {t('send')}
        </Button>
      </div>
    </section>
  );
};
