import { Migration } from '@mikro-orm/migrations';

export class Migration20250416102730 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_vendor_admin_location_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vendor_admin_location_unique" ON "vendor_admin" (location) WHERE deleted_at IS NULL;`);
  }

}
