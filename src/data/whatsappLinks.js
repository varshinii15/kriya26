// WhatsApp group links for events
// Map event IDs to their WhatsApp group links
// If an event doesn't have a link, it will default to example.com

export const whatsappLinks = {
  // Example format:
  // "EVNT01": "https://chat.whatsapp.com/example1",
  // "EVNT02": "https://chat.whatsapp.com/example2",
  
  // Add more event IDs and their WhatsApp links here
};

// Helper function to get WhatsApp link for an event
export const getWhatsAppLink = (eventId) => {
  return whatsappLinks[eventId] || "https://example.com";
};
