import { createStore } from "@lavaz/store"
import { dateBox } from "./boxes/date.box"

export const store = createStore({
  date: dateBox,
})