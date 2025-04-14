import { Migration } from '@mikro-orm/migrations';

export class Migration20250414191159 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" alter column "warehouse_locations" type jsonb using ("warehouse_locations"::jsonb);`);
    this.addSql(`alter table if exists "vendor_admin" alter column "warehouse_locations" drop not null;`);
    this.addSql(`alter table if exists "vendor_admin" alter column "metadata" type jsonb using ("metadata"::jsonb);`);
    this.addSql(`alter table if exists "vendor_admin" alter column "metadata" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor_admin" alter column "warehouse_locations" type jsonb using ("warehouse_locations"::jsonb);`);
    this.addSql(`alter table if exists "vendor_admin" alter column "warehouse_locations" set not null;`);
    this.addSql(`alter table if exists "vendor_admin" alter column "metadata" type jsonb using ("metadata"::jsonb);`);
    this.addSql(`alter table if exists "vendor_admin" alter column "metadata" set not null;`);
  }

}
