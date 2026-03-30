import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { defaultValue: string }>) {
  const [value, setValue] = useState(defaultValue);
  const contextValue = useMemo(() => ({ value, setValue }), [value]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "inline-flex w-full items-center rounded-2xl bg-muted/70 p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  children,
  className,
  value,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const active = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.setValue(value)}
      className={cn(
        "inline-flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition",
        active ? "bg-background text-foreground shadow-sm" : "hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  value,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { value: string }>) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) {
    return null;
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
