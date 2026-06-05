import Script from 'next/script'

/**
 * ToolSchema Component
 * Generates advanced compound JSON-LD schema for SEO rich snippets.
 * Includes WebApplication, FAQPage, and BreadcrumbList schemas.
 */
export default function ToolSchema({ 
    name, 
    description, 
    applicationCategory = 'DeveloperApplication',
    operatingSystem = 'All',
    url,
    faqItems = [],
    breadcrumbs = []
}) {
    const canonicalUrl = url || `https://www.corehubtools.com/tools/${name.toLowerCase().replace(/\s+/g, '-')}`

    // 1. WebApplication Schema
    const webAppSchema = {
        '@type': 'WebApplication',
        '@id': `${canonicalUrl}#webapp`,
        name,
        description,
        applicationCategory,
        operatingSystem,
        url: canonicalUrl,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        }
    }

    // 2. FAQPage Schema (if faqItems provided)
    const faqSchema = faqItems.length > 0 ? {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.title,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.content
            }
        }))
    } : null

    // 3. BreadcrumbList Schema (if breadcrumbs provided)
    const breadcrumbSchema = breadcrumbs.length > 0 ? {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href.startsWith('http') ? item.href : `https://www.corehubtools.com${item.href.replace('#', '')}`
        }))
    } : null

    // Combine into @graph
    const graph = [webAppSchema]
    if (faqSchema) graph.push(faqSchema)
    if (breadcrumbSchema) graph.push(breadcrumbSchema)

    const schemaData = {
        '@context': 'https://schema.org',
        '@graph': graph
    }

    return (
        <Script
            id={`schema-${name.replace(/\s+/g, '')}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    )
}
