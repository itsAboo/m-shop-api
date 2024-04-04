import { RowDataPacket } from "mysql2";

export interface Order extends RowDataPacket {
  orderId?: number;
  userId?: number;
  cartId?: number;
  status?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  totalPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItems extends RowDataPacket {
  orderItemsId?: number;
  orderId?: number;
  productId?: number;
  quantity?: number;
  totalPrice?: number;
  color?: string;
  size?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
