export type CategoryId = "cafe" | "academy" | "personal";

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  surface: string;
  text: string;
}

export interface TemplateFonts {
  heading: string;
  body: string;
}

export interface Template {
  id: string;
  name: string;
  tagline: string;
  description: string;
  colors: TemplateColors;
  fonts: TemplateFonts;
  sections: string[];
  unsplashKeyword: string;
  referenceStyle: string;
  promptKeywords: string[];
  badge: string | null;
  badgeColor: string | null;
  mockupVariant: "classic" | "sidebar" | "magazine";
}

export interface TemplatesData {
  cafe: Template[];
  academy: Template[];
  personal: Template[];
}

export type ImageMode = "stock" | "upload";

export interface ModifyOptions {
  colorChange: boolean;
  textChange: boolean;
  sectionReorder: boolean;
}

export interface UserInputs {
  businessName: string;
  description: string;
  customColor: string;
  sectionOrder: string;
}

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: { html: string };
  };
  links: { html: string };
}
