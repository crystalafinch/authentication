function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen box-border flex gap-4 items-center justify-center">
      {children}
      <div className="bg-gray-200 grow h-full w-2xl"></div>
    </div>
  );
}

export default AuthLayout;
