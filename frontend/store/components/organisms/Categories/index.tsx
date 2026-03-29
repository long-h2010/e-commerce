import { CategoryCard } from '@/components/molecules';
import { Category, MainCategory } from '@/types';

export const Categories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className='flex flex-col py-20 mt-20 gap-4'>
      <p className='font-display text-2xl tracking-[0.25em] font-bold uppercase'>Categories</p>
      <div className='flex gap-10'>
        {categories
          .filter((cat) => MainCategory.includes(cat.category))
          .map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat.category}
              image={`/images/categories/${cat.category}.png`}
              amount={cat.totalProducts}
            />
          ))}
      </div>
    </div>
  );
};
