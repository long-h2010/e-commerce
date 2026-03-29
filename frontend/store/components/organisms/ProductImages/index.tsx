'use client';

import { Image } from 'antd';
import { useState } from 'react';

export const ProductImages = ({ images }: { images: string[] }) => {
  const [imgActive, setImgActive] = useState(0);

  return (
    <div className='flex gap-3'>
      <div className='flex flex-col gap-2 w-16 shrink-0'>
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            preview={false}
            onClick={() => setImgActive(idx)}
          />
        ))}
      </div>
      <div className='flex-1 gallery-main'>
        <Image src={images[imgActive]} alt='' />
      </div>
    </div>
  );
};
