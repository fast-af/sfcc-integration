/**
 * Object mapping schema to map the SFCC CustomerInfo object
 * to the Fast V1ResponseMap object.
 */
const CustomerInfoToV1ResponseMap = {
  // User information.
  "customer_info.customer_id": [
    {
      key: "user.user.externalUserId",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.userId",
      transform: (value: string): string => value,
    },
  ],
};

export { CustomerInfoToV1ResponseMap };