import Navbar from '../navbar/Navbar';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen text-slate-900">
      <Navbar />
      <div className="ml-20">{children}</div>
    </div>
  );
}

export default MainLayout;
