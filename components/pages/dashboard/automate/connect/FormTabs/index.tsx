import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useMemo } from "react";
import { FormMethod } from "./types";
import { tabs } from "./items";

/**
 * A functional component that renders a set of tabs for a form, allowing users to switch between different methods.
 *
 * @param {Object} props - The props for the `FormTabs` component.
 * @param {FormMethod} props.method - The currently selected form method.
 * @param {(method: FormMethod) => void} props.onSwitch - A callback function triggered when a tab is clicked, 
 * which switches the form method.
 *
 * @returns {JSX.Element} A styled tab component with buttons for switching between form methods.
 *
 * @remarks
 * - The component uses `useMemo` to optimize rendering of tabs.
 * - Each tab is styled dynamically based on whether it is active or not.
 * - The `Button` component is used for each tab, with hover and active states styled for better user experience.
 *
 * @example
 * ```tsx
 * <FormTabs
 *   method="email"
 *   onSwitch={(newMethod) => {}}
 * />
 * ```
 */

export const FormTabs = ({
  method,
  onSwitch,
}: {
  method: FormMethod;
  onSwitch: (method: FormMethod) => void;
}) => {
  const renderTabs = useMemo(
    () =>
      tabs.map(({ label, icon, value }) => {
        const isActive = method === value;
        return (
          <Button
            key={value}
            onClick={() => onSwitch(value)}
            type="button"
            variant="ghost"
            className={cn(
              "w-full justify-center rounded-lg text-sm transition-all",
              "py-3 px-4 flex items-center gap-2",
              "active:scale-[0.98]",
              isActive
                ? "bg-white text-black font-semibold shadow-sm border border-black/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            )}
          >
            {icon}
            <span>{label}</span>
          </Button>
        );
      }),
    [method, onSwitch]
  );

  return (
    <div className="flex justify-center mb-6 rounded-lg max-w-md mx-auto">
      <div className="flex bg-slate-50/50 border border-black/10 p-1.5 rounded-2xl gap-1 w-full">{renderTabs}</div>
    </div>
  );
};
