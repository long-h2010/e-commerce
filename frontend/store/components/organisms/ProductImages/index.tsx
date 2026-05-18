'use client';

import { ProductImage } from '@/types';
import { Image } from 'antd';
import { useState } from 'react';

export const ProductImages = ({ images }: { images: ProductImage[] }) => {
  const [imgActive, setImgActive] = useState<ProductImage>(
    images.filter((img) => img.isThumbnail == true)[0],
  );

  return (
    <div className='flex gap-3'>
      <div className='flex flex-col gap-2 w-16 shrink-0'>
        {images.map((img) => (
          <Image
            key={img.id}
            src={img.url}
            preview={false}
            loading='lazy'
            onClick={() => setImgActive(img)}
          />
        ))}
      </div>
      <div className='flex-1 gallery-main !w-full'>
        <Image src={imgActive.url} alt='' loading='lazy' className='!w-full' />
      </div>
    </div>
  );
};
