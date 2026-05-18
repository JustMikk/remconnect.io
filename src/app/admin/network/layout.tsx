import '@/app/network.css';

export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="net-scope" style={{ minHeight: '100%' }}>
      {children}
    </div>
  );
}
