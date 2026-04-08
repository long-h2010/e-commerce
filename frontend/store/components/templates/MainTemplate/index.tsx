import { Footer, Header, Sidebar } from '@/components/organisms';

export const MainTemplate = ({
  children,
  sidebar = false,
}: {
  children: React.ReactNode;
  sidebar?: boolean;
}) => {
  return (
    <>
      <Header />
      <div className={`${sidebar ? 'flex' : 'px-16'}`}>
        {sidebar && <Sidebar />}
        {children}
      </div>
      <Footer />
    </>
  );
};
