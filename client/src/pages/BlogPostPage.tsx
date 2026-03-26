import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/shared/SEO';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author?: { firstName?: string; lastName?: string };
}

function useBlogPost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get(`/blog/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}

/** Minimal Markdown-to-HTML renderer for headings, bold, italic, paragraphs */
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2 text-gray-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-10 mb-4 text-gray-900">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/^/, '<p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/$/, '</p>');
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug ?? '');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 animate-pulse">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-6" />
        <div className="h-64 bg-gray-200 rounded-xl mb-8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded mb-3 last:w-3/4" />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 text-center">
        <p className="text-4xl mb-4">😔</p>
        <p className="text-gray-500">Статья не найдена</p>
        <Link to="/blog" className="mt-4 inline-block text-[#F5A623] hover:underline">← К блогу</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={post.title} description={post.excerpt} image={post.imageUrl} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F5A623]">
          <ArrowLeft size={15} /> Назад к блогу
        </Link>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 leading-tight">{post.title}</h1>

        <div className="mb-6 flex items-center gap-3 text-sm text-gray-400">
          <CalendarDays size={14} />
          {formatDate(post.createdAt)}
          {post.author?.firstName && (
            <span>· {post.author.firstName} {post.author.lastName}</span>
          )}
        </div>

        {post.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img src={post.imageUrl} alt={post.title} className="w-full h-72 object-cover" />
          </div>
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </article>
    </>
  );
}
