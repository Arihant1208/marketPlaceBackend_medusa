import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Get vendor details using Query
  const {
    data: [vendor],
  } = await query.graph({
    entity: "vendor",
    fields: ["id", "name", "handle", "logo", "admins.*"],
    filters: {
      id: [vendorId],
    },
  });

  if (!vendor) {
    return res.status(404).json({
      message: "Vendor not found",
    });
  }

  res.json({
    vendor,
  });
};
