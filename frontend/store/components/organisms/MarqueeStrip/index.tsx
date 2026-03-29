import { Divider } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export const MarqueeStrip = () => {
  const t = useTranslations('home');

  const raws = useMemo<Record<string, string>>(() => {
    const raw = t.raw('benefits');
    return typeof raw === 'object' && raw !== null ? raw : {};
  }, [t]);

  const benefits = useMemo(
    () =>
      Object.entries(raws).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : key,
      })),
    [raws],
  );

  return (
    <div className='flex bg-stone-900 overflow-hidden whitespace-nowrap justify-center items-center'>
      <div className='inline-flex animate-marquee gap-10 justify-center items-center'>
        {[...benefits, ...benefits].map((b, idx) => (
          <Divider key={`${b.key}-${idx}`} className='!border-white !w-1'>
            <span
              className='flex text-[10px] tracking-[0.25em] uppercase text-white/60'
            >
              {b.value}
            </span>
          </Divider>
        ))}
      </div>
    </div>
  );
};
