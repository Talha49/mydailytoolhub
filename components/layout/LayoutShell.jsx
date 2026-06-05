import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Main Layout Shell
 * 
 * Provides consistent Navbar and Footer across all pages.
 */
export default function LayoutShell({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 animate-fadeIn">
                {children}
            </main>
            <Footer />
        </div>
    )
}
