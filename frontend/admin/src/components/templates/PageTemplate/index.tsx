import { OverViewStats } from '@/components/organisms';

export const PageTemplate = ({
  overview,
  children,
}: {
  overview?: any[];
  children: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col gap-10'>
      {overview && <OverViewStats stats={overview} />}
      {children}
    </div>
  );
};
