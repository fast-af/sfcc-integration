const newOrder = {
  app_id: "83c7cc27-c87e-401e-88a9-fdd10e64473b",
  request_id: { value: "02f19d25-eb9e-4845-96e1-c2f2bf87cd6e" },
  order: {
    is_cart: true,
    order: {
      bill_to: {},
      device_info: { ip_address: "2603:7000:a205:bf9b:55e2:515:ceb2:77b0" },
      id: { value: "03ea028d-6dc1-4315-a593-86089fe47db3" },
      lines: [
        {
          external_product_id: "664729",
          id: { value: "a0e38547-5e94-47df-abae-224f51f4c41b" },
          quantity: 1,
          subtotal_amount: "0.00",
          tax_amount: "0.00",
          total_amount: "0.00",
        },
      ],
      order_type: "ORDER_TYPE_CART",
      status: "ORDER_STATUS_CART",
    },
  },
  type: "ENTITY_TYPE_ORDER",
};

const updateOrder = {
  order: {
    is_cart: true,
    items: [
      {
        external_product_id: "123",
        item_id: {
          value: "c9b97e89-b71a-4883-b9a4-c9c71af95ffc",
        },
        quantity: 1,
      },
    ],
    order_id: {
      value: "d9b44fc5-7203-49e6-b086-4fe7e592db32",
    },
  },
  request_id: {
    value: "99f65477-2511-4388-8442-8a863d4db005",
  },
  type: "ENTITY_TYPE_ORDER",
};

const deleteOrder = {
  app_id: "83c7cc27-c87e-401e-88a9-fdd10e64473b",
  request_id: { value: "02f19d25-eb9e-4845-96e1-c2f2bf87cd6e" },
  type: "ENTITY_TYPE_ORDER",
  order: {
    is_cart: true,
    order_id: { value: "03ea028d-6dc1-4315-a593-86089fe47db3" },
  },
};

const readOrder = {
  order: {
    external_order_id: "79856877-dcdd-4822-8ec4-00a85f857ada",
    is_cart: true,
  },
  type: "ENTITY_TYPE_ORDER",
};

export { newOrder, updateOrder, deleteOrder, readOrder };
