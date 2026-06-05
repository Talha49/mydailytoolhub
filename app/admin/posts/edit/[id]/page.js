import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import BlogEditor from '@/components/admin/BlogEditor'

export const metadata = {
  title: 'Edit Article | Admin Dashboard',
}

export default async function EditPostPage({ params }) {
  const { id } = await params
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title="Edit Post" />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <BlogEditor id={id} />
          </div>
        </main>
      </div>
    </div>
  )
}
