'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children: React.ReactNode; 
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

interface CustomSelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

// Custom Select Item Component
const CustomSelectItem: React.FC<CustomSelectItemProps> = ({
  value,
  children,
  className,
  disabled,
  onClick, // Destructure onClick
}) => {
  return (
    <div
      data-value={value}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick} // Apply onClick to the div
    >
      {children}
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {/* CheckIcon will be rendered by the parent CustomSelect based on selected value */}
      </span>
    </div>
  );
};

// Custom Select Component
const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled,
  children,
  className,
  triggerClassName,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (selectedValue: string) => {
      onValueChange(selectedValue);
      setIsOpen(false);
    },
    [onValueChange]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node) &&
      contentRef.current &&
      !contentRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const selectedChild = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child as React.ReactElement<CustomSelectItemProps>).props.value === value
  ) as React.ReactElement<CustomSelectItemProps> | undefined;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName
        )}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="block truncate">
          {selectedChild ? selectedChild.props.children : placeholder}
        </span>
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            "absolute z-50 mt-1 w-full min-w-[8rem] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md max-h-60",
            contentClassName
          )}
          style={{
            top: triggerRef.current ? triggerRef.current.offsetHeight + triggerRef.current.offsetTop : 'auto',
            left: triggerRef.current ? triggerRef.current.offsetLeft : 'auto',
            width: triggerRef.current ? triggerRef.current.offsetWidth : 'auto',
          }}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === CustomSelectItem) {
              const itemChild = child as React.ReactElement<CustomSelectItemProps>;
              return React.cloneElement(itemChild, {
                onClick: () => handleSelect(itemChild.props.value),
                className: cn(
                  itemChild.props.className,
                  value === itemChild.props.value && "font-semibold"
                ),
                children: (
                  <>
                    {itemChild.props.children}
                    {value === itemChild.props.value && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    )}
                  </>
                ),
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export { CustomSelect, CustomSelectItem };
