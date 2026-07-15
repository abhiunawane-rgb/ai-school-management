import { cn } from '@/lib/utils';

type SelectFieldProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  options: readonly { value: string; label: string }[] | { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const selectClass =
  'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10';

export function SelectField({
  id,
  label,
  hint,
  required,
  className,
  placeholder,
  options,
  value,
  onChange,
  disabled,
}: SelectFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
        {required ? <span className="text-red-600 ml-0.5" aria-hidden>*</span> : null}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          selectClass,
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%2364748b%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat'
        )}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
