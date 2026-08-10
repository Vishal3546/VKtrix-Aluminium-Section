-- V2__create_schema.sql

-- 1. Create tables
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    auth_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    party_id UUID REFERENCES parties(id),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile_pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    system_id UUID NOT NULL REFERENCES profile_systems(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    weight_per_meter NUMERIC(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE formula_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    system_id UUID NOT NULL REFERENCES profile_systems(id),
    name VARCHAR(255) NOT NULL,
    expression TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE glass_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    thickness NUMERIC(5,2),
    price_per_sqft NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hardware_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    price NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    system_id UUID NOT NULL REFERENCES profile_systems(id),
    width NUMERIC(10,2),
    height NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE design_panels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    design_id UUID NOT NULL REFERENCES designs(id),
    glass_id UUID REFERENCES glass_master(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    total_amount NUMERIC(15,2),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    quotation_id UUID NOT NULL REFERENCES quotations(id),
    design_id UUID NOT NULL REFERENCES designs(id),
    amount NUMERIC(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    quotation_id UUID NOT NULL REFERENCES quotations(id),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable RLS and setup policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE formula_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE glass_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE hardware_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_tenants ON tenants FOR ALL USING (id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_users ON users FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_parties ON parties FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_projects ON projects FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_profile_systems ON profile_systems FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_profile_pieces ON profile_pieces FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_formula_master ON formula_master FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_glass_master ON glass_master FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_hardware_master ON hardware_master FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_designs ON designs FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_design_panels ON design_panels FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_quotations ON quotations FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_quotation_items ON quotation_items FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_sales_orders ON sales_orders FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- 3. Seed Data (R40 Casement Window)
DO $$
DECLARE
    default_tenant_id UUID := gen_random_uuid();
    system_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO tenants (id, name) VALUES (default_tenant_id, 'Default Seed Tenant');
    
    INSERT INTO profile_systems (id, tenant_id, name, description) 
    VALUES (system_id, default_tenant_id, 'R40 Casement Window', 'Seed System');
    
    INSERT INTO profile_pieces (tenant_id, system_id, name, type) VALUES 
    (default_tenant_id, system_id, 'Casement Mullion', 'MULLION'),
    (default_tenant_id, system_id, 'Fiber Mesh', 'NET');
    
    INSERT INTO hardware_master (tenant_id, name, type, price) VALUES 
    (default_tenant_id, 'Hivik Handle', 'HANDLE', 150.00),
    (default_tenant_id, '2d Hinge', 'HINGE', 80.00);
END $$;
