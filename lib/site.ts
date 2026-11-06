/**
 * Shared site-wide branding and ordering details.
 *
 * The WhatsApp number below is the number already used throughout the original
 * project (Navbar, Footer, floating button and contact page). Keep it in one
 * place so every ordering link stays in sync.
 */
export const SITE_NAME = "ST Lounge";
export const SITE_TAGLINE = "A World of Tea & Flavours";
export const SITE_URL = "https://steamasala.com";

export const WHATSAPP_NUMBER = "923343747649";
export const WHATSAPP_DISPLAY = "0334-3747649";
export const WHATSAPP_SECONDARY_DISPLAY = "0334-8882643";

export const DEFAULT_ORDER_MESSAGE =
  "Assalamualaikum! I would like to order from ST Lounge. Please share the details.";

/** Builds a wa.me URL with a safely encoded message. */
export function whatsappUrl(message: string = DEFAULT_ORDER_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Product-specific ordering link. The selected weight is included so the
 * conversation starts with everything the team needs to quote the order.
 */
export function productWhatsAppUrl(productName: string, weight?: string): string {
  const selection = weight ? `${productName} (${weight})` : productName;
  return whatsappUrl(
    `Assalamualaikum! I would like to order ${selection} from ST Lounge. Please share the details.`,
  );
}
