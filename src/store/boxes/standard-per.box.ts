import type { StandardPerItem } from "#/types/api/standard-personal.type";
import { createBox } from "@lavaz/store";

interface StandardPerState {
  items: Array<
    StandardPerItem & {
      id: string;
      value: number;
      customerId: string;
      isChange: boolean;
    }
  >;
  canSubmit: boolean;
}

const initialState = {
  items: [],
  canSubmit: false,
} satisfies StandardPerState as StandardPerState;

export const standardPerBox = createBox(initialState, (set) => ({
  setAll: (state: StandardPerState) => set(state),
  setUpdate: (id: string, value: number) =>
    set((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, value, isChange: true } : item
      ),
      canSubmit: true,
    }))
})).create();
