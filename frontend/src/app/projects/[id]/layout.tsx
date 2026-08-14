export function generateStaticParams() {
  return [{ id: '1' }, { id: 'mock' }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
