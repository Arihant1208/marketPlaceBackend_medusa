import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { z } from "zod";
import getAllVendorWorkflow from "../../../workflows/marketplace/get-all-vendors";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {

  const { result } = await getAllVendorWorkflow(req.scope).run();

  res.status(200).send({
     result,
  });
};
