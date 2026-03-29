import {
  FacebookOutlined,
  InstagramOutlined,
  TikTokOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const Footer = () => {
  const t = useTranslations('footer');
  const columns = Object.values(t.raw('columns'));
  const payments = Object.values(t.raw('payments'));

  return (
    <footer className='border-t border-stone-100 px-16 pt-16 pb-8'>
      <div className='grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-14'>
        <div>
          <span className='font-bold text-xl text-brand tracking-widest block mb-4'>
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
          <p className='text-xs text-stone-400 leading-relaxed max-w-[220px] mb-6'>
            {t('title')}
          </p>
          <div className='flex gap-3'>
            <Link href={'#'}>
              <FacebookOutlined style={{ fontSize: '32px' }} />
            </Link>
            <Link href={'#'}>
              <InstagramOutlined style={{ fontSize: '32px' }} />
            </Link>
            <Link href={'#'}>
              <TikTokOutlined style={{ fontSize: '32px' }} />
            </Link>
          </div>
        </div>
        {columns.map((c: any) => (
          <div key={c.title}>
            <h5 className='text-[10px] tracking-[0.2em] font-bold uppercase mb-5'>
              {c.title}
            </h5>
            <ul className='space-y-3'>
              {Object.values(c.items).map((item: any) => (
                <li key={item}>
                  <a
                    href='#'
                    className='text-xs text-stone-500 hover:text-stone-900 transition-colors'
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='border-t border-stone-100 pt-6 flex justify-between items-center'>
        <p className='text-[11px] text-stone-300'>{t('sign')}</p>
        <div className='flex gap-2'>
          {payments.map((p: any) => (
            <span key={p} className='text-[10px] text-stone-300 border border-stone-100 px-2.5 py-1 uppercase'>
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};
