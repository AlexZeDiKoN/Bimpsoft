// Field H 20 Characters
// String '' A text modifier for units, equipment, and installations; content is implementation specific.
export const additionalInformation = 'additionalInformation'

// Field X 14 Characters
// String '' A text modifier for units, equipment, and installations, that displays either altitude flight level,
// depth for submerged objects; or height of equipment or structures on the ground.
export const altitudeDepth = 'altitudeDepth'

// Field K 5 Characters
// String '' A text modifier for units and installations that indicates unit effectiveness or installation capability.
export const combatEffectiveness = 'combatEffectiveness'

// Field AF
// String '' Example: "Hawk" for Hawk SAM system.
export const commonIdentifier = 'commonIdentifier'

// Field AC
// String '' Three letter representing the country.
export const country = 'country'

// Field Q
// Number undefined At the moment all directions should be in degrees and not in mils.
// Set to an undefined to remove the direction arrow.
export const direction = 'direction'

// Field W 16 Characters
// String '' A text modifier for units, equipment,
// and installations that displays DTG format: DDHHMMSSZMONYYYY or "O/O" for on order.
export const dtg = 'dtg'

// Field AO
// String '' Engagement bar text, shall be arranged as follows: A:BBB-CC.
export const engagementBar = 'engagementBar'

// String '' Engagement bar type, should be one of the following "TARGET", "NON-TARGET", or "EXPIRED"
export const engagementType = 'engagementType'

// Field AE
// equipmentTeardownTime String '' Equipment teardown time in minutes.
export const equipmentTeardownTime = 'equipmentTeardownTime'

// Field J 2 Characters
// String '' A text modifier for units, equipment, and installations that consists of a one-letter reliability rating
// and a one-number credibility rating.
export const evaluationRating = 'evaluationRating'

// Field AQ 2 Characters
// String '' During ballistic missile defence, some tracks are designated as guarded by a particular unit.
export const guardedUnit = 'guardedUnit'

// Field AH
// String '' Example: Tactical Operations Centre put as 'TOC'.
export const headquartersElement = 'headquartersElement'

// Field M 21 Characters
// String '' A text modifier for units that indicates number or title of higher echelon command
// (corps are designated by Roman numerals).
export const higherFormation = 'higherFormation'

// Field N 3 Characters
// String '' A text modifier for equipment; letters "ENY" denote hostile symbols.
export const hostile = 'hostile'

// Field P 5 Characters
// String '' A text modifier displaying IFF/SIF Identification modes and codes.
export const iffSif = 'iffSif'

// Field Y 19 Characters
// String '' A text modifier for units, equipment, and installations that displays a symbol's location in degrees,
// minutes, and seconds (or in UTM or other applicable display format).
export const location = 'location'
export const locationX = 'locationY'
export const locationY = 'locationX'

// Field AD
// String '' "ELNOT" or "CENOT"
export const platformType = 'platformType'

// Field C or Field R 9 Characters
// String '' A text modifier in an equipment symbol that identifies the number of items present.
export const quantity = 'quantity'

// Field F 3 Characters
// String '' A text modifier in a unit symbol that displays (+) for reinforced, (-) for reduced,
// (±) reinforced and reduced.
export const reinforcedReduced = 'reinforcedReduced'

// Field R2
// String '' M = Mobile, S = Static, or U = Uncertain.
export const sigint = 'sigint'

// Field AR 3 Characters
// String '' Special track designators, such as Non-Real Time (NRT) and Tactically Significant (SIG) tracks,
// are denoted here.
export const specialDesignator = 'specialDesignator'

// Field L 1 Character
// String '' A text modifier for hostile equipment; "!" indicates detectable electronic signatures.
export const signatureEquipment = 'signatureEquipment'

// Field AA 9 Characters
// String '' A text modifier for units; indicator is contained inside the frame;
// contains the name of the special C2 Headquarters.
export const specialHeadquarters = 'specialHeadquarters'

// Field Z 8 Characters
// String '' A text modifier for units and equipment that displays velocity as set forth in MIL-STD-6040.
export const speed = 'speed'

// Number 0 This is the length of the speed leader in pixels, this will be independet of the size of the symbol.
export const speedLeader = 'speedLeader'

// Field G 20 Characters
// String '' A text modifier for units, equipment and installations; content is implementation specific.
export const staffComments = 'staffComments'

// Field AP 6 Characters
// String '' A six character text modifier used in Fire Support operations to uniquely designate targets
// in accordance with STANAG 2147, where characters 1 and 2 are alphabetic, and characters 3-6 are numeric: AANNNN.
export const targetNumber = 'targetNumber'

// Field V 24 Characters
// String '' A text modifier for equipment that indicates types of equipment.
export const type = 'type'

// Field T 21 Characters
// String '' A text modifier for units, equipment, and installations that uniquely identifies a particular symbol
// or track number. Identifies acquisitions number when used with SIGINT symbology.
export const uniqueDesignation = 'uniqueDesignation'
