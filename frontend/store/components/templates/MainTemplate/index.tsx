import { Footer, MainHeader } from '@/components/organisms';

export const MainTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainHeader />
      <div className='px-16'>{children}</div>
      <Footer />
    </>
  );
};
