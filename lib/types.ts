export type CategoryId = "cafe" | "academy" | "personal" | "religion" | "traditional";

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
  layoutType: "vertical" | "grid" | "overlay" | "finedining" | "casual";
}

export interface TemplatesData {
  cafe: Template[];
  academy: Template[];
  personal: Template[];
  religion: Template[];
  traditional: Template[];
}

export type ImageMode = "stock" | "upload";

export interface ModifyOptions {
  colorChange: boolean;
  textChange: boolean;
  sectionReorder: boolean;
  isMultiPage: boolean;
}

export interface UserInputs {
  businessName: string;
  description: string;
  customColor: string;
  sectionOrder: string;
  pickedColor: string;
  contact: string;
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
