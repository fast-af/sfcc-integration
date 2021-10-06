/**
 * Object mapping schema to map the Magento Customer object
 * to the Fast V1ReadRequest object.
 */
const UserToV1ReadResponseMap = {
  id: {
    key: "user.user.externalUserId",
    transform: (value: number): string => value.toString(),
  },
  email: "user.user.email",
  firstname: "user.user.firstName",
  lastname: "user.user.lastName",
  // : "user.user.phone" - associated at address level, may need to skip
  // TODO: Store credits (not applicable currently)
  // "user.user.storeCredit.currencyCode": "string",
  // "user.user.storeCredit.units": "string",
  // "user.user.storeCredit.nanos": 0,
};

export { UserToV1ReadResponseMap };
