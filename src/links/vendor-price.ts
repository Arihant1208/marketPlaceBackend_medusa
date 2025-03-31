import { defineLink } from "@medusajs/framework/utils";
import MarketplaceModule from "../modules/marketplace";
import PricingModule from "@medusajs/medusa/pricing";

export default defineLink(  
    
  PricingModule.linkable.price,
  MarketplaceModule.linkable.vendor
);