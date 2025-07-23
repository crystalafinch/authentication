function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen p-4 box-border flex gap-4 items-center justify-center">
      {children}
      <div className="bg-gray-200 grow h-full rounded-3xl w-2xl"></div>
    </div>
  );
}

export default AuthLayout;
