import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/shared/SEO';

interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  createdAt: string;
  author?: { firstName?: string; lastName?: string };
}

function useBlogPosts() {
  return useQuery<BlogPostPreview[]>({
    queryKey: ['blog'],
    queryFn: async () => {
      const { data } = await api.get('/blog');
      return data.data;
    },
  });
}

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <>
      <SEO title="Блог" description="Статьи о мёде, пасеке и здоровом образе жизни от пчеловодов из Кадымки." />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Блог</h1>
        <p className="mb-10 text-gray-500">Статьи о мёде, пасеке и здоровом образе жизни</p>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl overflow-hidden border">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">🍯</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="mb-2 font-semibold text-gray-900 group-hover:text-[#F5A623] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="flex-1 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <CalendarDays size={13} />
                    {formatDate(post.createdAt)}
                    {post.author?.firstName && (
                      <span>· {post.author.firstName} {post.author.lastName}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p>Статей пока нет. Загляните позже!</p>
          </div>
        )}
      </div>
    </>
  );
}
