import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { z } from "zod";
import createVendorWorkflow, {
  CreateVendorWorkflowInput,
} from "../../workflows/marketplace/create-vendor";

export const PostVendorCreateSchema = z
  .object({
    name: z.string(),
    handle: z.string().optional(),
    logo: z.string().optional(),
    admin: z
      .object({
        email: z.string(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        store_name: z.string(),
        description: z.string().optional(),
        tax_number: z.string().optional(),
        warehouse_locations: z.any(),
        location: z.string().optional(),
        metadata: z.any()
      })
      .strict(),
  })
  .strict();

type RequestBody = z.infer<typeof PostVendorCreateSchema>;

export const POST = async (
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  if (req.auth_context?.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request already authenticated as a vendor."
    );
  }

  const vendorData = req.validatedBody;

  const query = req.scope.resolve("query");

  // const {
  //   data: [res1],
  // } = await query.graph({
  //   entity: "vendor_admin",
  //   fields: ["*"],
  //   filters: {
  //     email: [vendorData.admin.email],
  //   },
  // });
  // console.log(res1)

  // if (!res1) {
  //   return res.status(500).json({
  //     message: "Vendor already exist",
  //   });
  // }

  // create vendor admin
  const { result } = await createVendorWorkflow(req.scope).run({
    input: {
      ...vendorData,
      authIdentityId: req.auth_context.auth_identity_id,
    } as CreateVendorWorkflowInput,
  });

  res.json({
    vendor: result.vendor,
  });
};
