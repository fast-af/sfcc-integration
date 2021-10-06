import OCAPI from "sfcc-ocapi-documents";

declare namespace OCAPI {
  // Per https://github.com/Teneff/sfcc-ocapi-documents#extending-the-document-objects
  // if the prefix c_ is not added, it will be automatically taken care of.
  namespace Custom {
    interface Order {
      fastId: string;
      fastStatus: string;
      fastEmailId: string;
      orderLevelDiscountTotal: string;
    };
    interface ProductItem {
      fastProdLineId: string;
      parentProductId: string;
      discountedUnitPrice: number;
      lineDiscountAmount: number;
    };
    interface OrderAddress {
      middleName: string;
      email: string;
    };
    interface Basket {
      fastId: string;
      fastStatus: string;
      fastEmailId: string;
      applicableShippingMethods: OCAPI.ShippingMethod[];
      orderLevelDiscountTotal: string;
    };
    interface Shipment {
      fastPlanId: string;
    };
  };
};
