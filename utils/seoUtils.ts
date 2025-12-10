import { Space } from "../types";

// Helper to generate SEO-friendly Alt and Title tags for images
export const getSeoImageAttributes = (
    title: string, 
    category: string, 
    location: string, 
    type: 'main' | 'gallery' | 'thumb' = 'main'
) => {
    const cleanTitle = title.replace(/"/g, '');
    const cleanLoc = location.replace(/"/g, '');
    
    let alt = `${cleanTitle} - ${category} for rent in ${cleanLoc} | NearbySpace India`;
    if (type === 'gallery') alt = `Interior view of ${cleanTitle} ${category} in ${cleanLoc}`;
    
    // Title tag helps with hover tooltip and AEO context
    const imgTitle = `${category} in ${cleanLoc} - ${cleanTitle} by NearbySpace`;

    return { alt, title: imgTitle };
};

// Generate Organization Schema (For Home/About)
export const generateOrganizationSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "NearbySpace",
        "url": "https://nearbyspace.app",
        "logo": "https://nearbyspace.app/logo.png",
        "description": "Premium space rental platform in India connecting property owners with professionals.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "101 Innovation Dr",
            "addressLocality": "Bangalore",
            "addressRegion": "KA",
            "postalCode": "560001",
            "addressCountry": "IN"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "Customer Service"
        },
        "sameAs": [
            "https://www.facebook.com/nearbyspace",
            "https://twitter.com/nearbyspace",
            "https://www.linkedin.com/company/nearbyspace"
        ]
    };
};

// Generate Product/Listing Schema (For Individual Spaces)
export const generateSpaceSchema = (space: Space) => {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": space.title,
        "image": [space.imageUrl, ...space.gallery],
        "description": space.description,
        "sku": space.id,
        "brand": {
            "@type": "Brand",
            "name": "NearbySpace"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://nearbyspace.app/spaces?id=${space.id}`,
            "priceCurrency": "INR",
            "price": space.price,
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Person",
                "name": space.ownerName
            }
        },
        "areaServed": {
             "@type": "City",
             "name": space.location
        }
    };
};

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (items: {name: string, item: string}[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://nearbyspace.app${item.item}`
        }))
    };
};