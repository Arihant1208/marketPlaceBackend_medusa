import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceModuleService from "../../../../modules/marketplace/service";
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace";

type CreateVendorAdminStepInput = {
  email: string;
  first_name?: string;
  last_name?: string;
  vendor_id: string;
  store_name?: string;
  description?: string;
  tax_number?: string;
  warehouse_locations?: any;
  location?: string;
  metadata?: any;
};

const createVendorAdminStep = createStep(
  "create-vendor-admin-step",
  async (adminData: CreateVendorAdminStepInput, { container }) => {
    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE);

    const vendorAdmin = await marketplaceModuleService.createVendorAdmins(
      adminData
    );

    return new StepResponse(vendorAdmin, vendorAdmin.id);
  },
  async (vendorAdminId, { container }) => {
    if (!vendorAdminId) {
      return;
    }

    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE);

    marketplaceModuleService.deleteVendorAdmins(vendorAdminId);
  }
);

export default createVendorAdminStep;
