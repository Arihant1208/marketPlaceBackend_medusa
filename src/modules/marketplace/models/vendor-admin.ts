import { model } from "@medusajs/framework/utils";
import Vendor from "./vendor";

const VendorAdmin = model.define("vendor_admin", {
  id: model.id().primaryKey(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),
  email: model.text().unique(),
  store_name: model.text().unique(),
  description: model.text().nullable(),
  tax_number: model.text().unique(),
  location:model.text(),
  warehouse_locations: model.json().nullable(),
  metadata:model.json().nullable(),
  vendor: model.belongsTo(() => Vendor, {
    mappedBy: "admins",
  }),
});

export default VendorAdmin;
