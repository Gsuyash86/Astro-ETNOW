 
  const OrgSchemaMicrosite = () => ({
    "@context":"https://schema.org",
    "@type":"NewsMediaOrganization",
    "name":"ET NOW",
    "url":"https://www.etnownews.com",
    "logo":{
    "@type":"ImageObject",
    "url": `${import.meta.env.PUBLIC_PHOTO_API}/photo/msid-95581012/95581012.jpg`,
    "width":600,
    "height":60
    },
    "address":{
    "@type":"PostalAddress",
    "streetAddress":"Plot No-FC 6, Second Floor, Film City, Noida Sector 16A,",
    "addressLocality":"Noida",
    "addressRegion":"India",
    "postalCode":"201301"
    },
    "contactPoint":{
    "@type":"ContactPoint",
    "telephone":"+91 – 0120 – 6634600",
    "contactType":"Customer Service",
    "areaServed":"IN",
    "availableLanguage":"English",
    "hoursAvailable":{
    "@type":"OpeningHoursSpecification",
    "opens":"09:00",
    "closes":"18:00"
    }
    },
    "sameAs":["https://www.facebook.com/etnow",
    "https://twitter.com/ETNOWlive",
    "https://www.instagram.com/etnow/",
    "https://www.youtube.com/user/ETnow"]
    }
    );
  
  export default OrgSchemaMicrosite;
  