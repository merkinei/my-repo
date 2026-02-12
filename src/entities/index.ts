/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: corevalues
 * Interface for CoreValues
 */
export interface CoreValues {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  valueTitle?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  iconImage?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType url */
  learnMoreUrl?: string;
}


/**
 * Collection ID: exampleprompts
 * Interface for ExamplePrompts
 */
export interface ExamplePrompts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  promptText?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  targetGrade?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}


/**
 * Collection ID: features
 * Interface for Features
 */
export interface Features {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  featureName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  featureImage?: string;
  /** @wixFieldType text */
  benefit?: string;
  /** @wixFieldType text */
  callToActionText?: string;
}


/**
 * Collection ID: howitworkssteps
 * Interface for HowItWorksSteps
 */
export interface HowItWorksSteps {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType number */
  stepNumber?: number;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  visualGuide?: string;
  /** @wixFieldType text */
  callToActionText?: string;
  /** @wixFieldType url */
  callToActionUrl?: string;
}
