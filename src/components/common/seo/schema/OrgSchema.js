import {
    LOGO_MSID,
  } from "@utils/common"
  
  export default function OrgSchema(channelId) {
    const EngSchemaSocialLinks = [
      "https://twitter.com/ETNOWlive",
      "https://www.facebook.com/etnow",
      "https://www.instagram.com/etnow/",
      "https://www.youtube.com/user/ETnow",
    ];
  
    let hoursAvailable = {
      "@type": "OpeningHoursSpecification",
      opens: "09:00",
      closes: "18:00",
    };
  
    return {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      name: "ET Now",
      url: import.meta.env.WEBAPP_BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${import.meta.env.NEXT_PUBLIC_PHOTO_API}/photo/msid-${
          LOGO_MSID
        }/${LOGO_MSID}.jpg`,
        width: 600,
        height: 60,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot No-FC 6, Second Floor, Film City, Noida Sector 16A,",
        addressLocality: "Noida",
        addressRegion: "India",
        postalCode: "201301",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91 – 0120 – 6634600",
        contactType: "Customer Service",
        areaServed: "IN",
        availableLanguage: "English",
        hoursAvailable: hoursAvailable,
      },
      sameAs: EngSchemaSocialLinks,
    };
  }
  