-- V10__add_default_tenant.sql
-- Insert the default tenant that TenantIdentifierResolver uses (00000000-0000-0000-0000-000000000000)
-- to avoid foreign key constraint violations when Hibernate saves @TenantId entities without auth context.

INSERT INTO tenants (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'System Default Tenant') ON CONFLICT (id) DO NOTHING;
