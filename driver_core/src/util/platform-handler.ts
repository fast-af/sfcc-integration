import magentoEventHandler from "../magento/util/sequence-handler";
import sfccEventHandler from "../sfcc/util/sequence-handler";

/**
 * This file is temporary and will be removed once the
 * platform-specific code is split for SFCC and Magento.
 */

// Get the platform flag from the environment variable.
const platform = process.env.PLATFORM_FLAG || "sfcc";
// Export an appropriate handler based on the platform flag.
export const platformHandler =
  platform === "sfcc" ? sfccEventHandler : magentoEventHandler;
