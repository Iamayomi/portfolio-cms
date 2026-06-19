type FieldPreviewProps = {
  label: string;
  value: string;
};

export function FieldPreview({ label, value }: FieldPreviewProps) {
  return (
    <div className="border-b border-ink/10 py-4 last:border-b-0">
      <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.24em] text-ink/45">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold leading-7 text-ink">{value}</p>
    </div>
  );
}
