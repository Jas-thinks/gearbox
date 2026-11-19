/**
 * Lead Scoring Service.
 *
 * Computes an automatic lead score (0–100) based on profile completeness
 * and signal strength. Higher score = higher outreach priority.
 *
 * This is pure business logic with no UI or DB dependencies.
 * The score is recalculated whenever a lead is created or updated.
 */

import type { CreateLeadInput } from "@/schemas/lead.schema";

export interface ScoreBreakdown {
  creatorType: number;        // 0–15
  equipmentOwned: number;     // 0–20
  equipmentInterest: number;  // 0–10
  websiteExists: number;      // 0–10
  instagramExists: number;    // 0–8
  linkedinExists: number;     // 0–7
  locationComplete: number;   // 0–10
  contactComplete: number;    // 0–10
  rentalFrequency: number;    // 0–10
  total: number;              // 0–100
}

const HIGH_VALUE_CREATOR_TYPES = [
  "rental_shop",
  "production_house",
  "agency",
  "filmmaker",
  "wedding_studio",
];

const MEDIUM_VALUE_CREATOR_TYPES = [
  "drone_operator",
  "photographer",
  "videographer",
  "content_creator",
];

const HIGH_VALUE_EQUIPMENT_KEYWORDS = [
  "arri", "red", "sony venice", "leica", "cooke", "zeiss", "angenieux",
  "inspire 2", "inspire 3", "mavic 3 cine", "m300", "freefly",
  "profoto b10", "profoto b1", "broncolor", "aputure 600", "aputure 300",
  "sachtler", "sound devices", "sennheiser mkh", "ronin 4d",
];

function containsHighValueEquipment(equipment: string[]): boolean {
  const joined = equipment.join(" ").toLowerCase();
  return HIGH_VALUE_EQUIPMENT_KEYWORDS.some((kw) => joined.includes(kw));
}

/**
 * Computes a score breakdown for a lead.
 */
export function computeLeadScore(
  input: Partial<CreateLeadInput>
): ScoreBreakdown {
  let creatorType = 0;
  if (input.creator_type) {
    if (HIGH_VALUE_CREATOR_TYPES.includes(input.creator_type)) {
      creatorType = 15;
    } else if (MEDIUM_VALUE_CREATOR_TYPES.includes(input.creator_type)) {
      creatorType = 10;
    } else {
      creatorType = 5;
    }
  }

  let equipmentOwned = 0;
  if (input.owned_equipment?.length) {
    const count = input.owned_equipment.length;
    const hasHighValue = containsHighValueEquipment(input.owned_equipment);
    equipmentOwned = Math.min(20, count * 3 + (hasHighValue ? 8 : 0));
  }

  let equipmentInterest = 0;
  if (input.interested_equipment?.length) {
    equipmentInterest = Math.min(10, input.interested_equipment.length * 3);
  }

  const websiteExists = input.website ? 10 : 0;
  const instagramExists = input.instagram_handle ? 8 : 0;
  const linkedinExists = input.linkedin_url ? 7 : 0;

  let locationComplete = 0;
  if (input.city) locationComplete += 5;
  if (input.state || input.country) locationComplete += 5;

  let contactComplete = 0;
  if (input.email) contactComplete += 5;
  if (input.phone) contactComplete += 5;

  let rentalFrequency = 0;
  if (input.rental_frequency === "daily") rentalFrequency = 10;
  else if (input.rental_frequency === "weekly") rentalFrequency = 8;
  else if (input.rental_frequency === "monthly") rentalFrequency = 5;
  else if (input.rental_frequency === "occasionally") rentalFrequency = 2;

  const total = Math.min(
    100,
    creatorType +
      equipmentOwned +
      equipmentInterest +
      websiteExists +
      instagramExists +
      linkedinExists +
      locationComplete +
      contactComplete +
      rentalFrequency
  );

  return {
    creatorType,
    equipmentOwned,
    equipmentInterest,
    websiteExists,
    instagramExists,
    linkedinExists,
    locationComplete,
    contactComplete,
    rentalFrequency,
    total,
  };
}
