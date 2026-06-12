interface Props {
  variant: 'green' | 'red' | 'yellow' | 'blue' | 'zinc' | 'orange';
  children: React.ReactNode;
}

const styles = {
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  zinc: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function AdminBadge({ variant, children }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wide border ${styles[variant]}`}>
      {children}
    </span>
  );
}
