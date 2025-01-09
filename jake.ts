type Input = {
  users: {
    id: number;
    name: string;
    address?: {
      street: string;
      city: string;
    };
    orders: {
      id: number;
      items: {
        productId: number;
        quantity: number;
      }[];
    }[];
  }[];
}

type userNames = '.users[].name'

type lol = '.users[].address.city'

type haha = "{userNames: .users[].name}"
/**
 * {
 *   userNames: string[]
 * }
 */

// Query: ".users[] | {id, orderCount: .orders.length}"
type Result5 = {
  id: number;
  orderCount: number;
}[]