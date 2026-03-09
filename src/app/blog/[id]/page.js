import BlogDetailClient from './BlogDetailClient';

export function generateMetadata({ params }) {
    // In a real app we would fetch the exact post data here to inject into the SEO metadata
    return {
        title: `Blog Post | Mind Gym`,
        description: 'Read the latest insights and stories from Mind Gym.',
    };
}

export default function BlogDetail({ params }) {
    return <BlogDetailClient id={params.id} />;
}
