export interface DimensionValidationResult {
  isValid: boolean;
  valueMm?: number;
  errorMessage?: string;
}

export function parseDimension(input: string): DimensionValidationResult {
  if (!input || input.trim() === '') {
    return { isValid: false, errorMessage: 'Dimension is required' };
  }

  const trimmed = input.trim();

  // Check for plain mm input (only digits or decimals)
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const value = parseFloat(trimmed);
    if (value <= 0) return { isValid: false, errorMessage: 'Must be greater than 0' };
    return { isValid: true, valueMm: value };
  }

  // Check for feet-inches shorthand, e.g., 10'6" or 10' or 10' 6"
  // ^(\d+)\s*'(?:\s*(\d+(?:\.\d+)?)\s*")?$
  const ftInMatch = trimmed.match(/^(\d+)\s*'(?:\s*(\d+(?:\.\d+)?)\s*")?$/);
  
  if (ftInMatch) {
    const feet = parseFloat(ftInMatch[1]);
    const inches = ftInMatch[2] ? parseFloat(ftInMatch[2]) : 0;
    
    // 1 foot = 304.8 mm, 1 inch = 25.4 mm
    const valueMm = (feet * 304.8) + (inches * 25.4);
    
    if (valueMm <= 0) return { isValid: false, errorMessage: 'Must be greater than 0' };
    // Optionally format to keep it relatively clean (e.g. 2 decimals)
    return { isValid: true, valueMm: parseFloat(valueMm.toFixed(2)) };
  }

  return { 
    isValid: false, 
    errorMessage: 'Invalid format. Use mm (e.g. 1200) or feet-inches (e.g. 4\'6")' 
  };
}
