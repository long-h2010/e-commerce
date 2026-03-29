import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const CategoryCard = ({
  category,
  image,
  amount,
}: {
  category: string;
  image: string;
  amount: number;
}) => {
  const t = useTranslations('product');

  return (
    <Link
      href={`/products/${category}`}
      className='relative overflow-hidden bg-stone-100 cursor-pointer group w-full'
    >
      <img src={image} alt='' className='w-full h-[500px]' />
      <div className='absolute inset-0 bg-stone-900 opacity-0 group-hover:opacity-[0.04] transition-opacity'></div>
      <div className='absolute bottom-7 left-7'>
        <p className='font-display text-2xl font-light capitalize'>
          {t.raw('category')[`${category}`]}
        </p>
        <p className='text-sm text-stone-400 tracking-wider'>
          {t('items', { amount: amount })}
        </p>
      </div>
    </Link>
  );
};
