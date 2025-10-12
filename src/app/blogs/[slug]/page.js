import BlogDetails from '../../../components/Blog/BlogDetails';
import RenderMdx from '../../../components/Blog/RenderMdx';
import Tag from '../../../components/Elements/Tag';
import Comments from '../../../components/Blog/Comments';
import RelatedPosts from '../../../components/Blog/RelatedPosts';
import ReadingProgress from '../../../components/Blog/ReadingProgress';
import siteMetadata from '../../../utils/siteMetaData';
import { getBlogBySlug } from '../../../lib/blog';
import { slug as slugify } from 'github-slugger';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // This will be implemented later if needed
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  const publishedAt = new Date(blog.publishedAt).toISOString();
  const modifiedAt = new Date(blog.updatedAt || blog.publishedAt).toISOString();

  let imageList = [siteMetadata.socialBanner];
  if (blog.image) {
    imageList = Array.isArray(blog.image) ? blog.image : [blog.image];
  }
  const ogImages = imageList.map(img => {
    return { url: img.includes('http') ? img : siteMetadata.siteUrl + img };
  });

  const authors = blog?.author ? [blog.author] : siteMetadata.author;

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: siteMetadata.siteUrl + blog.url,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      authors: authors,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: ogImages,
    },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Extract TOC from content
  const headings = [];
  const lines = blog.content.split('\n');

  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const slugText = slugify(text);

      headings.push({
        level: level.toString(),
        text: text,
        slug: slugText,
      });
    }
  });

  // Update blog object with TOC
  blog.toc = headings;

  const publishedAt = new Date(blog.publishedAt).toISOString();
  const modifiedAt = new Date(blog.updatedAt || blog.publishedAt).toISOString();

  // Image handling for OpenGraph (if needed, otherwise remove)
  let imageList = [siteMetadata.socialBanner];
  if (blog.image) {
    imageList = Array.isArray(blog.image) ? blog.image : [blog.image];
  }
  const ogImages = imageList.map(img => {
    return { url: img.includes('http') ? img : siteMetadata.siteUrl + img };
  });

  const authors = blog?.author ? [blog.author] : siteMetadata.author;

  return (
    <>
      <ReadingProgress />
      <article>
        <div className='mb-8 text-center relative w-full h-[70vh] bg-dark'>
          <div className='w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {blog.tags.map(tag => (
                <Tag
                  key={tag}
                  name={tag}
                  link={`/categories/${slugify(tag)}`}
                  className='px-6 text-sm py-2'
                />
              ))}
            </div>
            <h1 className='inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6'>
              {blog.title}
            </h1>
          </div>
          <div className='absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40' />
          <Image
            src={blog.image}
            alt={blog.title}
            width={1200}
            height={628}
            className='aspect-square w-full h-full object-cover object-center'
            priority
            sizes='100vw'
          />
        </div>
        <BlogDetails blog={blog} slug={slug} />

        <div className='grid grid-cols-12  gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10'>
          <div className='col-span-12  lg:col-span-4'>
            <details
              className='border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto'
              open
            >
              <summary className='text-lg font-semibold capitalize cursor-pointer'>
                Table Of Content
              </summary>
              <ul className='mt-4 font-in text-base'>
                {headings.length > 0 ? (
                  headings.map(heading => {
                    return (
                      <li key={`#${heading.slug}`} className='py-1'>
                        <a
                          href={`#${heading.slug}`}
                          data-level={heading.level}
                          className={`data-[level=two]:pl-0  data-[level=two]:pt-2 data-[level=two]:border-t border-solid border-dark/40 data-[level=three]:pl-4 sm:data-[level=three]:pl-6 flex items-center justify-start `}
                        >
                          <span className='hover:underline'>
                            {heading.text}
                          </span>
                        </a>
                      </li>
                    );
                  })
                ) : (
                  <li className='py-1 text-gray-500 dark:text-gray-400'>
                    No headings found
                  </li>
                )}
              </ul>
            </details>
          </div>
          <RenderMdx blog={blog} />
        </div>

        {/* Comments Section */}
        <Comments blogSlug={slug} />

        {/* Related Posts */}
        <RelatedPosts currentBlog={blog} />
      </article>
    </>
  );
}
