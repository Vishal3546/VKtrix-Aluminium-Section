// Mock data for Auto Design form

export const windowTypes = [
  "2 Track Slider",
  "3 Track Slider",
  "Casement Openable",
  "Fixed",
  "Ventilation",
  "Door"
];

export const profileSystems = [
  { id: 1, name: "Premium System 25mm", type: "2 Track Slider" },
  { id: 2, name: "Premium System 25mm", type: "3 Track Slider" },
  { id: 3, name: "Eco System 18mm", type: "2 Track Slider" },
  { id: 4, name: "Eco System 18mm", type: "3 Track Slider" },
  { id: 5, name: "Casement Series 40", type: "Casement Openable" },
  { id: 6, name: "Fixed Section 40", type: "Fixed" },
  { id: 7, name: "Louver Series", type: "Ventilation" },
  { id: 8, name: "Heavy Door Series", type: "Door" },
];

export const profileLengths = [
  "12 Foot",
  "14 Foot",
  "16 Foot",
  "18 Foot",
  "21 Foot"
];

export const glassOptions = [
  "5mm Clear",
  "5mm Tinted",
  "6mm Clear",
  "6mm Toughened",
  "8mm Toughened",
  "DGU 18mm (5+8+5)"
];

export const parties = [
  { id: 1, name: "Acme Corp" },
  { id: 2, name: "BuildWell Builders" },
  { id: 3, name: "Skyline Developers" }
];

export const projects = [
  { id: 101, partyId: 1, name: "Acme HQ Renovation" },
  { id: 102, partyId: 1, name: "Acme Warehouse" },
  { id: 103, partyId: 2, name: "BuildWell Towers" },
  { id: 104, partyId: 3, name: "Skyline Vista Phase 1" }
];

export const designSelections = [
  "Partition",
  "Fix Partition",
  "Casement",
  "2/3-Door Casement",
  "X-2X-X",
  "2/3/4/5/8-Slider",
  "4-Advance",
  "Cashmen Slider"
];

// Mock API functions with artificial delay
export const fetchProfileSystemsByType = async (type: string) => {
  return new Promise<typeof profileSystems>((resolve) => {
    setTimeout(() => {
      resolve(profileSystems.filter(p => p.type === type));
    }, 200);
  });
};

export const fetchProjectsByParty = async (partyId: number) => {
  return new Promise<typeof projects>((resolve) => {
    setTimeout(() => {
      resolve(projects.filter(p => p.partyId === partyId));
    }, 200);
  });
};

export const simulateFormulaEngine = async (widthMm: number, heightMm: number, type: string) => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      // Simulate generating a layout based on type
      let panels = [];
      if (type === "2 Track Slider" || type === "Casement Openable" || type === "Door") {
        panels = [
          { id: 'p1', panelIndex: 1, panelType: type === 'Casement Openable' ? 'CASEMENT' : 'SLIDING', widthMm: widthMm / 2, heightMm: heightMm },
          { id: 'p2', panelIndex: 2, panelType: type === 'Casement Openable' ? 'CASEMENT' : 'SLIDING', widthMm: widthMm / 2, heightMm: heightMm }
        ];
      } else if (type === "3 Track Slider") {
        panels = [
          { id: 'p1', panelIndex: 1, panelType: 'SLIDING', widthMm: widthMm / 3, heightMm: heightMm },
          { id: 'p2', panelIndex: 2, panelType: 'SLIDING', widthMm: widthMm / 3, heightMm: heightMm },
          { id: 'p3', panelIndex: 3, panelType: 'SLIDING', widthMm: widthMm / 3, heightMm: heightMm }
        ];
      } else {
        panels = [
          { id: 'p1', panelIndex: 1, panelType: 'FIXED', widthMm, heightMm }
        ];
      }
      
      resolve({
        id: 'auto-gen-' + Date.now(),
        widthMm,
        heightMm,
        layoutType: 'GRID',
        gridRows: 1,
        gridCols: panels.length,
        panels
      });
    }, 500);
  });
};

export const profileCompanies = [
  "Jindal Aluminium",
  "Hindalco",
  "Bhoruka Extrusions",
  "Alom Extrusions"
];

export const glassBrands = [
  "Saint Gobain",
  "Modi Glass",
  "Asahi India Glass (AIS)",
  "Gold Plus Glass"
];

export const mockSavedDesigns = [
  {
    id: 'sd-1',
    sr: 1,
    designName: 'Master Bed Window',
    shortDescription: '3 Track Slider',
    widthMm: 3000,
    heightMm: 3000,
    profileSystem: '26MM REGAL',
    fittings: 'Touch Lock, Wheel',
    glass: 'Saint Gobain 6mm',
    qty: 1,
    sqFtRate: 450,
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  },
  {
    id: 'sd-2',
    sr: 2,
    designName: 'Balcony Door',
    shortDescription: '2-Door Casement',
    widthMm: 2100,
    heightMm: 2400,
    profileSystem: '40MM DOOR SYSTEM',
    fittings: 'Handle, 3D Hinge',
    glass: 'Modi Glass 8mm Toughened',
    qty: 2,
    sqFtRate: 850,
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  },
  {
    id: 'sd-3',
    sr: 3,
    designName: 'Kitchen Vent',
    shortDescription: 'Awning',
    widthMm: 600,
    heightMm: 600,
    profileSystem: 'ECO 18MM',
    fittings: 'Friction Stay, Handle',
    glass: 'Frosted 5mm',
    qty: 1,
    sqFtRate: 350,
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  }
];
