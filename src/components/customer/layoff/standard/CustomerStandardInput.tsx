import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { store } from "#/store/store";
import { useAppStore } from "@lavaz/store";
import React, { useEffect, useState } from "react";

export function CustomerStandardInput({
  id,
  value,
  stationCode,
}: {
  id: string;
  stationCode: string;
  value: number;
}) {
  const [currentValue, setCurrentValue] = useState<number | string>(0);
  const [, { setUpdate }] = useAppStore(store.standardPersonal, (s) => s);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setCurrentValue(rawVal);

    const numVal = rawVal === "" ? 0 : Number(rawVal);

    // Gọi setUpdate đúng theo signature (id, value) của store
    setUpdate(id, numVal);
  };

  return (
    <Field>
      <FieldLabel className="uppercase font-semibold text-primary truncate">
        {stationCode}
      </FieldLabel>
      <Input
        type="number"
        value={currentValue}
        onChange={handleChange}
        className="h-8 text-right text-xs px-2"
      />
    </Field>
  );
}
