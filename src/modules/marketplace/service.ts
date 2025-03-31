import { MedusaService } from "@medusajs/framework/utils";
import Vendor from "./models/vendor";
import VendorAdmin from "./models/vendor-admin";
import InviteVendor from "./models/invite-vendor";
class MarketplaceModuleService extends MedusaService({
  Vendor,
  VendorAdmin,
  InviteVendor
}) {}

export default MarketplaceModuleService;
