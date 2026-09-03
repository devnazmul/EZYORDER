import { ICustomer, IOrder } from "@/features/reports/types";

export type ICustomerAddressable =
  | ICustomer
  | IOrder
  | {
      door_no?: string | number | null;
      customer_address?: string | null;
      address?: string | null;
      Address?: string | null;
      customer_post_code?: string | null;
      post_code?: string | null;
      [key: string]: unknown;
    }
  | null
  | undefined;

export interface IGetCustomerFullAddressOptions {
  includeDoorNo?: boolean;
  includePostCode?: boolean;
}

/**
 * Formats full address string from a Customer or Order object.
 *
 * @param customer - ICustomer | IOrder | object containing address fields
 * @param options - optional formatting flags
 * @returns Formatted full address string
 */
export function getCustomerFullAddress(
  customer: ICustomerAddressable,
  options: IGetCustomerFullAddressOptions = {},
): string {
  if (!customer) return "";

  const { includeDoorNo = true, includePostCode = true } = options;

  let streetAddress = "";
  if (typeof customer.customer_address === "string") {
    streetAddress = customer.customer_address;
  } else if (typeof customer.address === "string") {
    streetAddress = customer.address;
  } else if (typeof customer.Address === "string") {
    streetAddress = customer.Address;
  }

  let postCode = "";
  if (typeof customer.customer_post_code === "string") {
    postCode = customer.customer_post_code;
  } else if (typeof customer.post_code === "string") {
    postCode = customer.post_code;
  }

  const doorNo =
    includeDoorNo && customer.door_no !== null && customer.door_no !== undefined
      ? String(customer.door_no).trim()
      : "";

  const addressParts: string[] = [];
  if (doorNo) addressParts.push(doorNo);
  if (streetAddress) addressParts.push(streetAddress);

  const formattedAddressWithDoor = addressParts.join(", ");

  if (includePostCode && postCode) {
    if (formattedAddressWithDoor) {
      return `${formattedAddressWithDoor} - ${postCode}`;
    }
    return postCode;
  }

  return formattedAddressWithDoor;
}

export default getCustomerFullAddress;
