/**
 * Object mapping schema to map the SFCC Customer object
 * to the Fast V1ReadRequest object.
 */
const CustomerToV1ReadResponseMap = {
  "customer_id": "user.user.externalUserId",
  "email": "user.user.email",
  "first_name": "user.user.firstName",
  "last_name": "user.user.lastName",
  // TODO: Need to check phone_home and phone_business as well.
  "phone_mobile": "user.user.phone",
  // TODO: Store credits (not applicable currently)
};

export { CustomerToV1ReadResponseMap };