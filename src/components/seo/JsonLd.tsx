import React from "react";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://maplece.com/#website",
        "url": "https://maplece.com",
        "name": "Maple Consulting Engineers",
        "description":
          "Premier Civil & Structural Engineering Consultancy delivering innovative, practical and sustainable solutions for high-rises, commercial, healthcare, and industrial structures.",
        "publisher": {
          "@id": "https://maplece.com/#organization",
        },
        "inLanguage": "en-US",
      },
      {
        "@type": "Organization",
        "@id": "https://maplece.com/#organization",
        "name": "Maple Consulting Engineers",
        "legalName": "Maple Consulting Engineers",
        "url": "https://maplece.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://maplece.com/icon.svg",
          "width": 128,
          "height": 128,
        },
        "image": "https://maplece.com/og-image.jpg",
        "email": "maplececlt@gmail.com",
        "founder": [
          {
            "@type": "Person",
            "name": "Muhammed Shameer V.P.",
            "jobTitle": "Co-Founder & Principal Structural Engineer",
            "description":
              "M-Tech in Structural Engineering. Specialist in seismic analysis, high-rise framing, and computational structural design.",
          },
          {
            "@type": "Person",
            "name": "Davis Jose Abraham",
            "jobTitle": "Co-Founder & Principal Structural Engineer",
            "description":
              "M-Tech in Structural Engineering. Specialist in civil infrastructure, heritage rehabilitation, and international building codes.",
          },
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-8281334435",
            "contactType": "customer service",
            "email": "maplececlt@gmail.com",
            "areaServed": ["IN", "AE"],
            "availableLanguage": ["English", "Malayalam", "Hindi"],
          },
          {
            "@type": "ContactPoint",
            "telephone": "+91-9946625063",
            "contactType": "technical inquiries",
            "areaServed": ["IN"],
            "availableLanguage": ["English", "Malayalam", "Hindi"],
          },
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://maplece.com/#headoffice",
        "name": "Maple Consulting Engineers - Calicut Head Office",
        "description":
          "Civil and Structural Engineering consultancy head office in Calicut (Kozhikode), Kerala. Specialist in high-rise RCC framing, PEB design, ETABS/SAP2000 analysis, and project management.",
        "url": "https://maplece.com",
        "telephone": "+91 8281 33 44 35",
        "email": "maplececlt@gmail.com",
        "priceRange": "$$$",
        "image": "https://maplece.com/og-image.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Near Popular Vehicle Showroom, Meleparamba",
          "addressLocality": "Calicut",
          "addressRegion": "Kerala",
          "postalCode": "673001",
          "addressCountry": "IN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 11.2588,
          "longitude": 75.7804,
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            "opens": "09:00",
            "closes": "18:00",
          },
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Engineering Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Civil & Structural Engineering Design",
                "description":
                  "Analysis and detailing of RCC, Structural Steel, Pre-stress Concrete and Hybrid structures using ETABS, SAP2000, SAFE, and STAAD Pro.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Structural Assessment and Rehabilitation",
                "description":
                  "Condition assessment, non-destructive testing, distress diagnostics, and structural retrofitting solutions.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Project Management Consultancy (PMC)",
                "description":
                  "Planning, scheduling, quality audits, site supervision, and milestone tracking for civil developments.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Quantity Survey and BOQ Estimation",
                "description":
                  "Comprehensive material estimation, rate analysis, and contract documentation.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Value Engineering Services",
                "description":
                  "Optimization of structural schemes minimizing material expenditures while maintaining factor-of-safety standards.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Supervision of Construction & Quality Audit",
                "description":
                  "On-site quality verification, reinforcement inspection, and concrete cube test compliance.",
              },
            },
          ],
        },
        "department": [
          {
            "@type": "ProfessionalService",
            "name": "Maple Consulting Engineers - Palakkad Branch",
            "telephone": "+91 8281 33 44 35",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Civil Station Road",
              "addressLocality": "Palakkad",
              "addressRegion": "Kerala",
              "addressCountry": "IN",
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 10.7867,
              "longitude": 76.6548,
            },
          },
          {
            "@type": "ProfessionalService",
            "name": "Maple Consulting Engineers - Kochi Branch",
            "telephone": "+91 9946 62 50 63",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Marine Drive",
              "addressLocality": "Kochi",
              "addressRegion": "Kerala",
              "addressCountry": "IN",
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 9.9816,
              "longitude": 76.2753,
            },
          },
          {
            "@type": "ProfessionalService",
            "name": "Maple Consulting Engineers - Bengaluru (Bangalore) Branch",
            "telephone": "+91 8281 33 44 35",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "80ft Road, 4th Block, Koramangala",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "postalCode": "560034",
              "addressCountry": "IN",
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 12.9352,
              "longitude": 77.6245,
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
