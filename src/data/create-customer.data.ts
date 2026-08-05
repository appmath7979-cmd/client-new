import type { Customer } from "#/schema/create-customer.schema";

export const customerData = {
  fullName: "",
  phoneNumber: "",
  type: "GUEST",
  tinhUi: false,
  xienMienBac: false,
  settings: [
    {
      name: "b2",
      c: { MB: 0.7, MT: 0.7, MN: 0.7 },
      t: { MB: 70, MT: 70, MN: 70 },
      type: "tile",
    },
    {
      name: "dd2",
      c: { MB: 0.7, MT: 0.7, MN: 0.7 },
      t: { MB: 70, MT: 70, MN: 70 },
      type: "tile",
    },
    {
      name: "da",
      c: { MB: 0.7, MT: 0.7, MN: 0.7 },
      t: { MB: 250, MT: 350, MN: 350 },
      type: "tile",
    },
    {
      name: "dax",
      c: { MB: 50.4, MT: 50.4, MN: 50.4 },
      t: { MB: 500, MT: 500, MN: 500 },
      type: "tile",
    },
    {
      name: "b3",
      c: { MB: 0.7, MT: 0.7, MN: 0.7 },
      t: { MB: 600, MT: 600, MN: 600 },
      type: "tile",
    },
    {
      name: "dd3",
      c: { MB: 0.7, MT: 0.7, MN: 0.7 },
      t: { MB: 500, MT: 500, MN: 500 },
      type: "tile",
    },
    {
      name: "b4",
      c: { MB: 0.7, MT: 0.7, MN: 0.7 },
      t: { MB: 4000, MT: 4000, MN: 4000 },
      type: "tile",
    },
  ],
  dat: "KY_RUOI",
  daxt: "KY_RUOI",
} satisfies Customer as Customer;