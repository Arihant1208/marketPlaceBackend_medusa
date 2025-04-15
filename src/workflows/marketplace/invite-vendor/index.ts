import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceModuleService from "../../../modules/marketplace/service";
import { MARKETPLACE_MODULE } from "../../../modules/marketplace";
import { Modules } from "@medusajs/framework/utils";
import { createPriceSetsStep } from "@medusajs/medusa/core-flows";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

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
  async ({ vendor_email }: WorkflowInput) => {
    try {
      const inviteUrl = `http://localhost:3000/signup-vendor/?email=${vendor_email}`

      const data = await resend.emails.send({
        from: process.env.RESEND_FROM as string, 
        to: vendor_email,
        subject: "Vendor Invitation",
        html: `
          <p>Hello,</p>
          <p>You've been invited to become a vendor.</p>
          <p><a href="${inviteUrl}">Sign up here</a>.</p>
        `,
        text: `Hello, You've been invited to become a vendor. Sign up here: ${inviteUrl}`,
      })

      console.log("Resend email data:", data)
    } catch (error) {
      console.error("Error sending vendor invite email:", error)
    }
  }
)

const inviteVendorWorkflow = createWorkflow(
  "invite-vendor",
  function (input: WorkflowInput) {
    const str1 = step1(input);
    const str2 = step2(input);

    const data = createPriceSetsStep([{
      prices: [
        {
          amount: 103232,
          currency_code: "usd",
        }
      ]
    }])

    return new WorkflowResponse({
      message: "email sent successfully",
      data: str1,
    });
  }
);

export default inviteVendorWorkflow;
