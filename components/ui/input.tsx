import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string,
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "form-input w-full body-l bg-white dark:bg-dark-2 border border-light-2 dark:border-medium-2 rounded-md px-4 py-2 text-dark-1 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary",
            error && "form-input-error",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && errorMessage && <p className="absolute right-0 text-destructive body-m mt-1">{errorMessage}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }

