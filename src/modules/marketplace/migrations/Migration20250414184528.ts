import { Migration } from '@mikro-orm/migrations';

export class Migration20250414184528 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" drop constraint if exists "vendor_admin_location_unique";`);
    this.addSql(`alter table if exists "vendor_admin" drop constraint if exists "vendor_admin_tax_number_unique";`);
    this.addSql(`alter table if exists "vendor_admin" drop constraint if exists "vendor_admin_store_name_unique";`);
    this.addSql(`alter table if exists "vendor_admin" add column if not exists "store_name" text not null, add column if not exists "description" text null, add column if not exists "tax_number" text not null, add column if not exists "location" text not null, add column if not exists "warehouse_locations" jsonb not null, add column if not exists "metadata" jsonb not null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_admin_store_name_unique" ON "vendor_admin" (store_name) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_admin_tax_number_unique" ON "vendor_admin" (tax_number) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_admin_location_unique" ON "vendor_admin" (location) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_vendor_admin_store_name_unique";`);
    this.addSql(`drop index if exists "IDX_vendor_admin_tax_number_unique";`);
    this.addSql(`drop index if exists "IDX_vendor_admin_location_unique";`);
    this.addSql(`alter table if exists "vendor_admin" drop column if exists "store_name", drop column if exists "description", drop column if exists "tax_number", drop column if exists "location", drop column if exists "warehouse_locations", drop column if exists "metadata";`);
  }

}
