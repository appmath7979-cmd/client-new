import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import type React from "react";

export function TextField({
  label,
  id,
  error,
  ...props
}: {
  label?: string;
  id?: string;
  error?: string;
} & React.ComponentProps<"input">) {
  return (
    <Field>
      <div className="flex flex-col gap-1">
        {label ? <FieldLabel htmlFor={id ?? ""}>{label}</FieldLabel> : null}
        <Input id={id ?? ""} {...props} />
      </div>
      <em className="text-destructive">{error ?? ""}</em>
    </Field>
  );
}
