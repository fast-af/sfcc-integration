/**
 *
 * @param typ {Record<string, unknown> | unkown} - The value type.
 * @returns {object} - an object.
 */
export const arrayItemsEnclosing = (typ: Record<string, unknown> | unknown): Record<string, unknown> => {
  return { arrayItems: typ };
};
/**
 *
 * @param typs {Record<string, unknown>[] | unkown[]} - The value types.
 * @returns {object} - an object.
 */
export const unionMembersEnclosing = (...typs: Record<string, unknown>[] | unknown[]): Record<string, unknown> => {
  return { unionMembers: typs };
};
/**
 *
 * @param props 
 * @param additional {boolean} - Any additional 
 * @returns {object} - an object.
 */
export const objectEnclosing = (props: Record<string, unknown>[] | unknown[], additional: boolean): Record<string, unknown> => {
  return { props, additional };
};
/**
 *
 * @param name {string} - Name of the reference object.
 * @returns {object} - an object.
 */
export const referenceEnclosing = (name: string): Record<string, unknown> => {
  return { ref: name };
};
