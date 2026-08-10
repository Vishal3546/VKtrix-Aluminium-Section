-- V8__fix_design_sashes_types.sql

ALTER TABLE design_sashes
ALTER COLUMN width TYPE DOUBLE PRECISION,
ALTER COLUMN height TYPE DOUBLE PRECISION;
