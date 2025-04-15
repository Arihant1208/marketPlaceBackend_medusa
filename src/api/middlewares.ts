import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http";
import { PostVendorCreateSchema } from "./vendors/route";
import { AdminCreateProduct } from "@medusajs/medusa/api/admin/products/validators";
import { ConfigModule } from "@medusajs/framework/types";
import { parseCorsOrigins } from "@medusajs/framework/utils";
import cors from "cors";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/vendors*",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          const configModule: ConfigModule = req.scope.resolve("configModule");
          return cors({
            origin: parseCorsOrigins(configModule.projectConfig.http.storeCors),
            credentials: true,
          })(req, res, next);
        },
      ],
    },
    // Your existing middleware configurations
    {
      matcher: "/vendors",
      method: ["POST"],
      middlewares: [
        authenticate("vendor", ["session", "bearer"], {
          allowUnregistered: true,
        }),
        validateAndTransformBody(PostVendorCreateSchema),
      ],
    },
    {
      matcher: "/vendors/products",
      method: ["POST"],
      middlewares: [validateAndTransformBody(AdminCreateProduct)],
    },
    {
      matcher: "/admin/products",
      method: ["GET"],
      middlewares: [authenticate(["vendor", "user"], ["session", "bearer"])],
    },
    {
      matcher: "/vendors/*",
      middlewares: [authenticate("vendor", ["session", "bearer"])],
    },
    {
      matcher: "/admin/*",
      middlewares: [authenticate(["vendor", "user"], ["session", "bearer"])],
    },
  ],
});