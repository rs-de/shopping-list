export default function Typography({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`prose lg:prose-lg w-full prose-slate ${className}`}>
      {children}
    </div>
  );
}
