import BlogDetailClient from './BlogDetailClient';

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: `${id} | Mind Gym`,
        description: 'Read the latest insights and stories from Mind Gym.',
    };
}

export default async function BlogDetail({ params }) {
    const { id } = await params;
    return <BlogDetailClient id={id} />;
}
