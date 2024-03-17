const Input = ({
  label,
  placeholder,
  value,
  onChange
}: {
  value?: any;
  onChange?: any;
  label: string;
  placeholder?: string;
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        type="text"
        className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
