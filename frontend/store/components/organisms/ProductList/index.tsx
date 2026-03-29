import { ProductCard } from '@/components/molecules';
import { ProductBase } from '@/types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const ProductList = ({
  title,
  products,
}: {
  title?: boolean;
  products: ProductBase[];
}) => {
  const scrollProd = (dir: number) => {
    const track: any = document.getElementById('prod-track');
    track.scrollBy({ left: dir * 540, behavior: 'smooth' });
  };

  return (
    <div className='flex flex-col py-20 gap-4'>
      {title && (
        <div className='flex justify-between'>
          <p className='font-display text-2xl tracking-[0.25em] font-bold uppercase'>
            Products
          </p>
          <div className='flex gap-3'>
            <Button
              shape='circle'
              icon={<LeftOutlined />}
              onClick={() => scrollProd(-1)}
            />
            <Button
              shape='circle'
              icon={<RightOutlined />}
              onClick={() => scrollProd(1)}
            />
          </div>
        </div>
      )}
      <div
        id='prod-track'
        className='flex gap-6 w-full overflow-x-auto'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab  ',
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p}/>
        ))}
      </div>
    </div>
  );
};
