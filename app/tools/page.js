import { Suspense } from 'react'
import ToolsClient from './_clients/ToolsClient'

export const metadata = {
  title: 'Explore Developer & Writing Tools',
  description: 'Browse all online tools by category and search instantly.',
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsPageSkeleton />}>
      <ToolsClient />
    </Suspense>
  )
}

function ToolsPageSkeleton() {
  return (
    <div className="container-custom py-20 text-center text-text-muted-light">
      Loading tools…
    </div>
  )
}
