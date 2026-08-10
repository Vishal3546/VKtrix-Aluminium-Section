-- V3__advanced_quotation_schema.sql

-- 1. Extend Tenants Table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS quote_footer_branding VARCHAR(255);

-- 2. Extend Quotations Table
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS transportation_cost NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS loading_unloading_cost NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS gst_percent NUMERIC(5,2) DEFAULT 18;

-- 3. Extend Design Panels Table (for VENTILATION panels)
ALTER TABLE design_panels ADD COLUMN IF NOT EXISTS panel_type VARCHAR(50) DEFAULT 'GLASS';

-- 4. Create New Tables for Advanced Architecture
CREATE TABLE IF NOT EXISTS design_sashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., 'S1', 'S2'
    width NUMERIC(10,2),
    height NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sash_accessories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    sash_id UUID NOT NULL REFERENCES design_sashes(id) ON DELETE CASCADE,
    hardware_id UUID NOT NULL REFERENCES hardware_master(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS design_panel_glass (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    panel_id UUID NOT NULL REFERENCES design_panels(id) ON DELETE CASCADE,
    glass_id UUID NOT NULL REFERENCES glass_master(id),
    pane_number INTEGER NOT NULL, -- e.g., 1, 2, 3
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enable RLS on New Tables
ALTER TABLE design_sashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sash_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_panel_glass ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_design_sashes ON design_sashes FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_sash_accessories ON sash_accessories FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
CREATE POLICY tenant_isolation_design_panel_glass ON design_panel_glass FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
