import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceModuleService from "../../../modules/marketplace/service";
import { MARKETPLACE_MODULE } from "../../../modules/marketplace";


const step1 = createStep(
  "step-1",
  async ( {},{ container }) => {
    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE);

    const [vendors, count] = await marketplaceModuleService.listAndCountInviteVendors();

    return new StepResponse({data:vendors,count:count});
  }
);

const getAllVendorWorkflow = createWorkflow(
  "get-all-vendor",
  function () {
    const str1 = step1();
    return new WorkflowResponse({
      message: "All invite vendors fetch succesfully",
      data: str1,
    });
  }
);

export default getAllVendorWorkflow;
