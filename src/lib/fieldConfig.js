/**
 * ClickUp Custom Field IDs for the Projects list.
 * These are the exact UUIDs from your workspace — do not change them
 * unless the fields are recreated.
 */

// ─── Fields read on load (pre-filled for inspector) ───
export const READ_FIELDS = {
  address:         "4a0d22c4-6ca8-4988-8b0e-7c8699d24ef0",
  bin:             "6f7bc095-e095-44ff-ad43-7973c0c17f54",
  bbl:             "eecd4918-6da6-41ef-8d85-ea14140e1bda",
  dateOfInspection:"c772070d-1ce6-43b2-8477-55c2a5652e37",
  entity:          "d9759cde-e3ca-49c9-8b34-413ab28445c0",
  clientContact:   "9f71b221-995d-4940-81c7-82fce1f79135",
  billingAddress:  "b3e37e90-5b7d-4393-b60f-a6a921570f9a",
};

// ─── Fields written on submit (inspector fills in) ───
export const WRITE_FIELDS = {
  parapetMaterials:      "d98f82bd-b202-4d6b-b090-66f8eb83f528",
  pastRepairs:           "ad436ee7-9679-4f04-83d2-5488babf0a48",
  northParapetCondition: "fdace429-8650-4995-878a-bdb461b4f5bc",
  eastParapetCondition:  "7ccad2e8-ba4a-4442-a74a-3fcc79482948",
  southParapetCondition: "7ba0e651-8eb6-4f69-9833-02e441c495d5",
  westParapetCondition:  "b52ffb81-026d-4b30-ae8c-1a89129d436a",
  northParapetInfo:      "97b42dac-1323-4a8e-a6dc-7d0cbe3d064f",
  eastParapetInfo:       "632cae26-5993-4d6e-857e-751550c507e8",
  southParapetInfo:      "8d04ca19-eb02-4c02-a7b5-8ceab3f07a06",
  westParapetInfo:       "277a303b-3ca0-403e-a7e3-b703acb30c3e",
  northParapet:          "f6402db5-64e9-4c43-9af1-9f23c1d62e9a",  // attachment
  eastParapet:           "9e4633c2-4fd3-498a-ade1-81568b27d146",  // attachment
  southParapet:          "80fd6d6e-78c3-4253-95fb-c816696f669d",  // attachment
  westParapet:           "f7e35a6b-0237-4a18-b26f-1803a30f94f9",  // attachment
  video360:              "9268b177-ed1b-4618-8b23-8a9fa46b8dfd",  // attachment
  parapetScore:          "a42f0afb-f48b-4c2b-994d-c5505bda5434",  // emoji
  inspectorSignature:    "d039d94d-1f64-4eb7-ba6c-5680624fcf3d",  // signature
  projectPhase:          "ac6371ec-a08b-44ac-8e1c-a169c9fd00c9",
};

// ─── Dropdown option UUIDs ───

export const PARAPET_MATERIALS_OPTIONS = {
  "Brick":                  "2ba74d89-0ece-4c04-a5f7-af113feff31e",
  "CMU (Concrete Masonry Unit)": "e0489130-85f1-4e19-b673-6782ee89c29c",
  "Stone":                  "f414e5df-9150-4dc4-96fd-649679d739bf",
  "Cast-in-Place Concrete": "b6755fbc-5e57-40c4-a89b-d68a8bb68be7",
  "Metal":                  "7a11b185-3de5-43ba-bba8-dc00dc9ff5ea",
  "Stucco/EIFS":            "9042e07f-2b5c-498b-a560-4752208cfdeb",
  "Other":                  "6da49656-edf4-48cd-a2e1-95686a5e6fce",
};

// Condition options per elevation (each has its own UUIDs)
export const CONDITION_OPTIONS = {
  north: {
    "Good Condition":       "04569e37-099e-43bb-8705-ae145b61c817",
    "Some Defects Present": "22e2912d-b00a-4274-bae6-a46d56cdafa5",
    "Catastrophic Failure": "40838c0d-164d-4e02-9147-861c79d67bc2",
  },
  east: {
    "Good Condition":       "d1dbd60b-d4d8-4c53-96a8-31fdb4cd9b19",
    "Some Defects Present": "4eb806c6-7480-4a40-b587-0ede9b65d0f0",
    "Catastrophic Failure": "128fc1ba-a383-4936-831c-611a8ddeef39",
  },
  south: {
    "Good Condition":       "5bd2fdea-149f-4654-aebf-68541f64fd8e",
    "Some Defects Present": "f73c0976-9c5b-4a9f-9f42-9e3f44f16363",
    "Catastrophic Failure": "d8d51705-abbf-4d0b-8ab3-1245f7961dd7",
  },
  west: {
    "Good Condition":       "00230f67-8105-46e8-b89d-067c23125e17",
    "Some Defects Present": "6bb5c46c-88e8-4b49-b380-5f3e486a37ba",
    "Catastrophic Failure": "8bbaa2ee-4b5c-41e3-b89f-112ea3a3e657",
  },
};

// Project Phase option UUIDs
export const PROJECT_PHASE_OPTIONS = {
  "Signed":     "8578722e-fb75-4dc2-b428-2a52cafae6ec",
  "Scheduling": "fdcc3d80-7114-47fd-b158-e42263cba96d",
  "Scheduled":  "26630190-5b52-43e1-8d8f-b8debd19389f",
  "Dispatched": "bdf5eb0c-8319-43b6-96c1-7267fcd1c8d1",
  "Inspected":  "6f4dd4ec-dbb5-40e8-b5e9-5ba6cc4b796a",
  "Completed":  "f9f87c1b-1a04-42e1-b461-08a75f2d53e6",
};

// Parapet Score mapping (emoji field: 1-based integer rating)
// Safe = 1, SWARMP = 2, Unsafe = 3
export const PARAPET_SCORE_MAP = {
  "Safe":    1,
  "SWARMP":  2,
  "Unsafe":  3,
};

// Defect checklist options
export const DEFECT_OPTIONS = [
  "Displacement",
  "Horizontal cracks",
  "Diagonal cracks",
  "Missing bricks",
  "Loose bricks",
  "Missing coping stones",
  "Loose coping stones",
  "Potential wiring issues",
];

// Elevation metadata
export const ELEVATIONS = [
  {
    key: "north",
    label: "North",
    conditionField: "northParapetCondition",
    infoField: "northParapetInfo",
    attachmentField: "northParapet",
  },
  {
    key: "east",
    label: "East",
    conditionField: "eastParapetCondition",
    infoField: "eastParapetInfo",
    attachmentField: "eastParapet",
  },
  {
    key: "south",
    label: "South",
    conditionField: "southParapetCondition",
    infoField: "southParapetInfo",
    attachmentField: "southParapet",
  },
  {
    key: "west",
    label: "West",
    conditionField: "westParapetCondition",
    infoField: "westParapetInfo",
    attachmentField: "westParapet",
  },
];
