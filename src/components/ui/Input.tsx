interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  readOnly,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
     <input
  type={type}
  placeholder={placeholder}
  value={value}
  onChange={onChange}
  readOnly={readOnly}
  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
/>

    </div>
  );
}
