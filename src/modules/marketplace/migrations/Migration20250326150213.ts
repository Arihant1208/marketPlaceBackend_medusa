import { Migration } from '@mikro-orm/migrations';

export class Migration20250326150213 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "invite-vendor-by-admin" ("id" text not null, "vendor_email" text not null, "status" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "invite-vendor-by-admin_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_invite-vendor-by-admin_deleted_at" ON "invite-vendor-by-admin" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "invite-vendor-by-admin" cascade;`);
  }

}
