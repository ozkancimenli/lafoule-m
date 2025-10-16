import HomeCoverSection from '../components/Home/HomeCoverSection';
import RecentPosts from '../components/Home/RecentPosts';
import { getAllBlogs, BlogPost } from '../lib/blog';

export default function Home(): JSX.Element {
  const blogs: BlogPost[] = getAllBlogs();

  return (
    <main className='flex flex-col items-center justify-center'>
      <HomeCoverSection blogs={blogs} />
      <RecentPosts blogs={blogs} />
    </main>
  );
}
