import { Button } from 'antd';

export const ColorSwatch = ({ hex, name }: { hex: string; name: string }) => {
  return (
    <div className='flex gap-2'>
      <Button
        shape='circle'
        disabled
        style={{
          backgroundColor: hex,
        }}
        size='small'
      />
      <span>{name}</span>
    </div>
  );
};
