import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  label,
  id,
  required,
  rows = 4,
  ...props 
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-4 py-3 rounded-lg border transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-0 resize-vertical",
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
            : "border-gray-300 focus:border-primary focus:ring-primary/20",
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;