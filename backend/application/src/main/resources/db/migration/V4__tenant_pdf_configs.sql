-- V4__tenant_pdf_configs.sql

-- Extend Tenants Table with PDF Configs
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS pre_requisites_checklist TEXT;

-- Update the default seed tenant to have mock T&Cs and Pre-Requisites
UPDATE tenants 
SET 
    terms_and_conditions = '<ul><li>Validity: 30 days from the date of quotation.</li><li>Payment Terms: 50% advance, balance before delivery.</li><li>Delivery: 2-3 weeks from receipt of advance and signoff.</li><li>Size Tolerance: +/- 2mm is standard in fabrication.</li><li>Service Charges: Civil work, scaffolding, and electrical work are in client scope.</li></ul>',
    pre_requisites_checklist = '<ul><li>Site must be clear of debris and have a flat sill for frame installation.</li><li>Permanent electricity supply must be available at site.</li><li>Opening dimensions must be finalized and plastered prior to measurement.</li><li>Safe storage area must be provided for materials.</li></ul>',
    quote_footer_branding = 'Aluminium Section SaaS'
WHERE name = 'Default Seed Tenant';
