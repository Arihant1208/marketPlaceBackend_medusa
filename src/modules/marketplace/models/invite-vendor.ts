import { model } from "@medusajs/framework/utils";
import VendorAdmin from "./vendor-admin";

const InviteVendor = model.define("invite-vendor-by-admin", {
  id: model.id().primaryKey(),
  vendor_email: model.text(),
  status: model.text().nullable(),
});

export default InviteVendor;
