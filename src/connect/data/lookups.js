// Config-driven lookups — ports the CHANNEL_ENTITY_TYPE / PERSONAL_EMAIL_DOMAIN values
// actually seeded by alpha-api's 20260710120000_FINGRID_CONNECT_ONBOARDING migration
// (see docs/sdd/connect/04-db-schema.md), not invented. In production these come from
// GET /v1/lookup?group_code=... — hardcoded here only because WF1 itself isn't wired to a
// real endpoint yet (auth bootstrap unresolved, see services/connectApi.js).

export const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com',
  'ymail.com', 'icloud.com', 'protonmail.com', 'live.com', 'msn.com',
];

export const ENTITY_TYPES = [
  { key: 'dsa_ind', label: 'DSA — Individual', role: 'DSA', category: 'SOURCING', icon: '🧑‍💼' },
  { key: 'dsa_firm', label: 'DSA — Firm / LLP', role: 'DSA', category: 'SOURCING', icon: '🧑‍💼' },
  { key: 'lsp', label: 'LSP / Aggregator', role: 'LSP', category: 'SOURCING', icon: '🔗', isLSP: true },
  { key: 'bc', label: 'Business Correspondent', role: 'BC', category: 'SOURCING', icon: '🏪', mandatoryCredential: 'RBI_BC' },
  { key: 'nbfc', label: 'NBFC', role: 'OWNBOOK', category: 'MERCHANT', icon: '🏦', isLender: true },
  { key: 'bank', label: 'Bank', role: 'OWNBOOK', category: 'MERCHANT', icon: '🏛️', isLender: true },
  { key: 'hfc', label: 'HFC', role: 'OWNBOOK', category: 'MERCHANT', icon: '🏠', isLender: true },
  { key: 'colender', label: 'Co-Lending NBFC', role: 'COLENDER', category: 'MERCHANT', icon: '🤝', isLender: true },
  { key: 'verif_agency', label: 'Verification Agency', role: 'SERVICE', category: 'SERVICING', icon: '🔍' },
  { key: 'collection_agency', label: 'Collection Agency', role: 'SERVICE', category: 'SERVICING', icon: '💼', mandatoryCredential: 'RDAI' },
  { key: 'legal_agency', label: 'Legal Agency', role: 'SERVICE', category: 'SERVICING', icon: '⚖️', mandatoryCredential: 'BAR_COUNCIL' },
  { key: 'property_agency', label: 'Property Agency', role: 'SERVICE', category: 'SERVICING', icon: '🏠', mandatoryCredential: 'IBBI' },
];

// BR-03: mandatory-credential labels, verified against alpha-api/app/services/connect/helper.go
export const CREDENTIAL_LABELS = {
  RBI_BC: 'RBI BC Empanelment',
  RDAI: 'RDAI Registration',
  IBBI: 'IBBI Registered Valuer Certificate',
  BAR_COUNCIL: 'Bar Council Enrollment',
};

export const DESIGNATIONS = {
  dsa_ind: ['Proprietor/Owner', 'Partner', 'BDM', 'Field Executive'],
  dsa_firm: ['Director', 'Partner', 'Business Head', 'Sales Manager', 'Relationship Manager', 'Other'],
  lsp: ['Director', 'CEO/Founder', 'Business Head', 'Sales Manager', 'Ops Manager', 'Other'],
  bc: ['Director', 'BC Manager', 'Branch Head', 'Field Officer', 'Other'],
  nbfc: ['MD/CEO', 'COO', 'CFO', 'Head Channel Sales', 'BDM', 'Relationship Manager', 'Other'],
  bank: ['GM', 'DGM', 'Branch Head', 'Relationship Manager', 'Other'],
  hfc: ['MD/CEO', 'Head Retail Lending', 'BDM', 'Relationship Manager', 'Other'],
  colender: ['MD/CEO', 'CFO', 'Head Co-Lending', 'BDM', 'Other'],
  verif_agency: ['MD/CEO', 'Operations Head', 'FI Manager', 'Quality Head', 'Other'],
  collection_agency: ['MD/CEO', 'Collections Head', 'Tele-calling Head', 'Field Manager', 'Other'],
  legal_agency: ['Managing Partner', 'Senior Advocate', 'Partner', 'Associate', 'Other'],
  property_agency: ['MD/CEO', 'Chief Valuer', 'IBBI Valuer', 'Operations Head', 'Other'],
};

export const DEPARTMENTS = {
  dsa_ind: ['Sales', 'Operations', 'Finance'],
  dsa_firm: ['Business Dev', 'Sales', 'Operations', 'Finance'],
  lsp: ['Business Dev', 'Technology', 'Operations', 'Finance'],
  bc: ['Field Operations', 'Compliance', 'Finance'],
  nbfc: ['Channel & Distribution', 'Credit', 'Operations', 'Compliance', 'Technology', 'Finance'],
  bank: ['Retail Banking', 'SME', 'Operations', 'Compliance', 'Finance'],
  hfc: ['Retail Lending', 'Operations', 'Compliance', 'Finance'],
  colender: ['Business Dev', 'Credit', 'Operations', 'Compliance', 'Finance'],
  verif_agency: ['Field Operations', 'Video KYC', 'Quality', 'Technology', 'Finance'],
  collection_agency: ['Tele-collections', 'Field Collections', 'Legal Collections', 'Technology'],
  legal_agency: ['Litigation', 'Documentation', 'Advisory', 'Conveyancing'],
  property_agency: ['Valuation', 'Title Search', 'Field Inspection', 'Quality'],
};

export const PARTNERSHIP_TYPES = [
  { key: 'seek_lender', label: 'Seeking Lender tie-ups' },
  { key: 'seek_dsa', label: 'Seeking DSA/LSP sourcing network' },
  { key: 'seek_bc', label: 'Seeking BC Partners' },
  { key: 'seek_colender', label: 'Seeking Co-Lending partners' },
  { key: 'seek_verif', label: 'Seeking Verification Agency' },
  { key: 'seek_collection', label: 'Seeking Collection Agency' },
  { key: 'seek_legal', label: 'Seeking Legal Agency' },
  { key: 'seek_property', label: 'Seeking Property/Valuation Agency' },
  { key: 'seek_empanelment', label: 'Seeking Lender Empanelment' },
];

export function entityByKey(key) {
  return ENTITY_TYPES.find((e) => e.key === key) || ENTITY_TYPES[1];
}

export function isPersonalDomain(domain) {
  return PERSONAL_EMAIL_DOMAINS.includes(domain.toLowerCase());
}
