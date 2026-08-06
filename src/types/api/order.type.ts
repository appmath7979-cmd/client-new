import type { Region } from "../region.type";
import type { MessageApi, TimeApi } from "./base.type";

interface IOrderDetailItem {
  number: string;
  customerId: string | null;
  id: string;
  type: string;
  date: string;
  syntax: string;
  stationCode: string;
  price: number;
  xac: number;
  co: number;
  trung: number;
  orderId: string;
}

interface IOrderItem extends TimeApi {
  id: string;
  details: Array<IOrderDetailItem & TimeApi>;
  customerId: string | null;
  release: string;
  isLayoff: boolean;
  region: Region;
  message: string;
  isSend: boolean | null;
}

interface IOrderApi extends MessageApi, IOrderItem {
  customer: {
    fullName: string;
    type: "OWNER" | "GUEST";
  }
}

export type { IOrderItem, IOrderApi };
