/**
 * BlogHeader Component
 * Simple, high-impact header for the blog section.
 */
export default function BlogHeader() {
    return (
        <div className="text-center max-w-2xl mx-auto mb-12 animate-slideUp">
            <h1 className="text-4xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-4 tracking-tight">
                Guides & <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                Expert tutorials, industry news, and deep dives into the world of web development and digital productivity.
            </p>
        </div>
    )
}
