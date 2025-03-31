import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceModuleService from "../../../modules/marketplace/service";
import { MARKETPLACE_MODULE } from "../../../modules/marketplace";
import { Modules } from "@medusajs/framework/utils";

type WorkflowInput = {
  vendor_email: string;
};

const step1 = createStep(
  "step-1",
  async ({ vendor_email }: WorkflowInput, { container }) => {
    const marketplaceModuleService: MarketplaceModuleService =
      container.resolve(MARKETPLACE_MODULE);

    const vendor = await marketplaceModuleService.createInviteVendors({
      vendor_email,
      status: "pending",
    });

    return new StepResponse(vendor);
  }
);

const step2 = createStep(
  "step-2",
  async ({ vendor_email }: WorkflowInput, { container }) => {
    const notificationModuleService = container.resolve(Modules.NOTIFICATION);

    const data = await notificationModuleService.createNotifications({
      to: vendor_email,
      channel: "email",
      template: "d-5fe2903a9d2d47dab88d2390baf6580c",
    });
  }
);

const inviteVendorWorkflow = createWorkflow(
  "invite-vendor",
  function (input: WorkflowInput) {
    const str1 = step1(input);
    const str2 = step2(input);
    return new WorkflowResponse({
      message: "email sent successfully",
      data: str1,
    });
  }
);

export default inviteVendorWorkflow;
