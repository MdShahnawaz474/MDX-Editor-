interface HeaderProps {
  theme: "dark" | "light";
  isLoading: boolean;
}

function PreviewHeader({ theme, isLoading }: HeaderProps) {
  const headerTheme =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-gray-100"
      : "bg-gray-100 border-gray-200 text-gray-900";

  return (
    <div className={`w-full ${headerTheme} border-b px-6 p-4 flex items-center justify-between`}>
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-sm font-medium tracking-wide uppercase">
          Markdown Preview
        </span>
      </div>
      {isLoading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span className="text-sm">Parsing...</span>
        </div>
      )}
    </div>
  );
}

export default PreviewHeader;
