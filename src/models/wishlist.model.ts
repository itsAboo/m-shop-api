import { RowDataPacket } from "mysql2";

export interface WishList extends RowDataPacket {
  wishListId?: number;
  userId?: number;
  productId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// export interface WishListItems extends RowDataPacket {
//   wishListItemsId?: number;
//   wishListId?: number;
//   productId?: number;
//   createdAt?: number;
//   updatedAt?: number;
// }
