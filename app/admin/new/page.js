import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import BlogEditor from '@/components/admin/BlogEditor'

export const metadata = {
  title: 'Create New Article | Admin Dashboard',
}

export default function NewPostPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title="Create New Post" />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <BlogEditor />
          </div>
        </main>
      </div>
    </div>
  )
}
