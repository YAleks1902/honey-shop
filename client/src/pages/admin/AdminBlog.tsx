import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAdminBlogPosts, useAdminCreateBlogPost, useAdminUpdateBlogPost, useAdminDeleteBlogPost } from '@/features/admin/useAdmin';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface BlogPost { id: string; title: string; slug: string; excerpt?: string; content: string; imageUrl?: string; isPublished: boolean; createdAt: string; }

function BlogPostModal({ post, onClose }: { post?: BlogPost; onClose: () => void }) {
  const { mutate: create, isPending: creating } = useAdminCreateBlogPost();
  const { mutate: update, isPending: updating } = useAdminUpdateBlogPost(post?.id ?? '');

  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    imageUrl: post?.imageUrl ?? '',
    isPublished: post?.isPublished ?? false,
  });

  const autoSlug = (t: string) => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post) update(form, { onSuccess: onClose });
    else create(form, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-5">
          <h2 className="font-bold text-gray-900 text-lg">{post ? 'Редактировать статью' : 'Новая статья'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input label="Заголовок *" value={form.title} onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value, slug: f.slug || autoSlug(e.target.value) })); }} required />
          <Input label="Slug *" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
          <Input label="URL изображения" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
          <div>
            <label className="mb-1 block text-sm text-gray-700">Анонс</label>
            <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">Содержание * (поддерживает Markdown)</label>
            <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={10} className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono focus:border-[#F5A623] focus:outline-none" required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="accent-[#F5A623]" />
            Опубликовать
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
            <Button type="submit" loading={creating || updating}>{post ? 'Сохранить' : 'Создать'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const { data: posts, isLoading } = useAdminBlogPosts();
  const { mutate: deletePost } = useAdminDeleteBlogPost();
  const [modal, setModal] = useState<{ open: boolean; post?: BlogPost }>({ open: false });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Блог</h1>
        <Button size="sm" onClick={() => setModal({ open: true })}>
          <Plus size={16} className="mr-1" /> Новая статья
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm divide-y">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-14 w-20 animate-pulse rounded bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-72 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))
        ) : (posts ?? []).map((post: BlogPost) => (
          <div key={post.id} className="flex items-center gap-4 p-4">
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="h-14 w-20 rounded object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 truncate">{post.title}</p>
                {post.isPublished
                  ? <Eye size={14} className="text-green-500 shrink-0" />
                  : <EyeOff size={14} className="text-gray-400 shrink-0" />
                }
              </div>
              <p className="text-xs text-gray-400 truncate">{post.slug} · {formatDate(post.createdAt)}</p>
              {post.excerpt && <p className="text-sm text-gray-500 truncate mt-0.5">{post.excerpt}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setModal({ open: true, post })} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                <Pencil size={15} />
              </button>
              <button
                onClick={() => { if (confirm(`Удалить "${post.title}"?`)) deletePost(post.id); }}
                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {!isLoading && (!posts || posts.length === 0) && (
          <p className="py-10 text-center text-sm text-gray-400">Статей нет</p>
        )}
      </div>

      {modal.open && <BlogPostModal post={modal.post} onClose={() => setModal({ open: false })} />}
    </div>
  );
}
