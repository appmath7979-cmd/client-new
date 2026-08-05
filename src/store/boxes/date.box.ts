import { createBox } from "@lavaz/store";

interface DateState {
  date: Date;
}

const initialState = {
  date: new Date()
} satisfies DateState as DateState

export const dateBox = createBox(initialState, set => ({
  setDate: (date: Date) => set(prev => ({ ...prev, date }))
})).create()