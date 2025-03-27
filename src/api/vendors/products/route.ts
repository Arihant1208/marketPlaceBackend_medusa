import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { HttpTypes } from "@medusajs/framework/types";
import createVendorProductWorkflow from "../../../workflows/marketplace/create-vendor-product";

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateProduct>,
  res: MedusaResponse
) => {
  const { result } = await createVendorProductWorkflow(req.scope).run({
    input: {
      vendor_admin_id: req.auth_context.actor_id,
      product: req.validatedBody,
    },
  });

  res.json({
    product: result.product,
  });
};
