import DiscountData from "./discount-data";

export default interface Discount {
  /**
   * @interface {DiscountData}
   * @memberof Discount
   */
  discount_data?: DiscountData;

  /**
   * @interface {string}
   * @memberof Discount
   */
  rule_label?: string;

  /**
   * @interface {number}
   * @memberof Discount
   */
  rule_id?: number;
}
