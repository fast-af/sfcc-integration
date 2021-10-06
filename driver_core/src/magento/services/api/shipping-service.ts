import ApiService from "./api-service";
import Address from "../../models/address";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import MagentoShippingOptionsItem from "../../models/magento-shipping-options-item";

export default class ShippingService extends ApiService {
  /**
   * Maps a region_id lookup to shipping address objects
   *
   * @param mappedAddresses {array} Magento shipping address objects
   *
   * @returns {EcommObject[]} array of updated shipping addresses
   */
  async mapShippingAddressesToRegions(
    mappedAddresses: EcommObject[]
  ): Promise<EcommObject[]> {
    const addresses = await Promise.all(
      mappedAddresses.map(async (address: any) => {
        const addressDetail = address.shipping_address as Address;
        const countryId = addressDetail.country_id;
        const stateCode = addressDetail.region_code;
        const http = await this.getHttp();
        const countryData = await http
          .get(`/directory/countries/${countryId}`)
          .then((response) => {
            this.logger(
              "shipping-service",
              "Fetched country detail - shipping",
              response.data
            );
            return response.data;
          })
          .catch((error) => {
            this.logger(
              "shipping-service",
              `Could not fetch details for ${countryId} - shipping`,
              error
            );
            throw `Magento API: ${error} - could not fetch country / region`;
          });
        const regionData = countryData.available_regions;
        const addressRegion = regionData.filter(
          (region: Record<string, unknown>) => region.code === stateCode
        )[0];

        address.shipping_address.region_id = parseInt(addressRegion.id);
        return address;
      })
    );
    return addresses;
  }

  async mapBillingAddressToRegion(address: EcommObject): Promise<EcommObject> {
    const addressDetail = address as any;
    const countryId = addressDetail.address.country_id;
    const stateCode = addressDetail.address.region_code;
    const http = await this.getHttp();
    const countryData = await http
      .get(`/directory/countries/${countryId}`)
      .then((response) => {
        this.logger(
          "shipping-service",
          "Fetched country detail - billing",
          response.data
        );
        return response.data;
      })
      .catch((error) => {
        this.logger(
          "shipping-service",
          `Could not fetch details for ${countryId} - billing`,
          error
        );
        throw `Magento API: ${error} - could not fetch country / region`;
      });
    const regionData = countryData.available_regions;
    const addressRegion = regionData.filter(
      (region: Record<string, unknown>) => region.code === stateCode
    )[0];

    addressDetail.address.region_id = parseInt(addressRegion.id);
    return addressDetail;
  }

  /**
   * Get estimated shipping for each address in array
   *
   * @param addresses {array} Magento shipping address objects
   * @param cartId {string} Cart ID
   *
   * @returns {EcommObject[]} array of updated shipping addresses
   */
  async getEstimatedShipping(
    addresses: EcommObject[],
    cartId: string
  ): Promise<MagentoShippingOptionsItem[]> {
    const shippingEstimates = await Promise.all(
      addresses.map(async (address: any) => {
        const addressDetail = address.shipping_address as Address;
        const http = await this.getHttp();
        const shippingEstimate = await http
          .post(`/guest-carts/${cartId}/estimate-shipping-methods`, {
            address: addressDetail,
          })
          .then((response) => {
            this.logger(
              "shipping-service",
              "Fetched shipping estimates",
              response.data
            );
            return response.data;
          })
          .catch((error) => {
            this.logger(
              "shipping-service",
              `Could not fetch shipping estimates`,
              error
            );
            throw `Magento API: ${error} - could not fetch shipping estimates`;
          });
        return shippingEstimate;
      })
    );
    return shippingEstimates;
  }

  async getZones(): Promise<EcommObject> {
    const http = await this.getHttp();
    return await http
      .get("/directory/countries")
      .then((response) => {
        this.logger(
          "shipping-service",
          "Fetched shipping zones",
          response.data
        );
        return response.data;
      })
      .catch((error) => {
        this.logger(
          "shipping-service",
          `Could not fetch shipping zones`,
          error
        );
        throw `Magento API: ${error} - could not fetch shipping zones`;
      });
  }
}
