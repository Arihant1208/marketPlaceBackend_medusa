import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { z } from "zod";
import inviteVendorWorkflow from "../../../workflows/marketplace/invite-vendor";

export const PostVendorInviteSchema = z
  .object({
    vendor_email: z.string(),
  })
  .strict();

type RequestBody = z.infer<typeof PostVendorInviteSchema>;

export const POST = async (
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  const vendorData = req.body;

  const { result } = await inviteVendorWorkflow(req.scope).run({
    input: {
      vendor_email: vendorData.vendor_email,
    },
  });

  res.status(200).send({
    data: result,
  });
};
