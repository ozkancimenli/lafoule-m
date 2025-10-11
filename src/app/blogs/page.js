import { allBlogs } from "contentlayer/generated";
import { sortBlogs } from "@/src/utils";
import BlogLayoutOne from "@/src/components/Blog/BlogLayoutOne";
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import BlogLayoutTwo from "@/src/components/Blog/BlogLayoutTwo";
import Categories from "@/src/components/Blog/Categories";
import BlogSearch from "@/src/components/Blog/BlogSearch";
import { slug } from "github-slugger";

export const metadata = {
  title: "All Blog Posts",
  description:
    "Explore every article by Ozkan Cimenli on web development, Next.js, accessibility, performance and productivity.",
};

const buildCategoryList = (blogs) => {
  const set = new Set(["all"]);

  blogs.forEach((blog) => {
    (blog.tags || []).forEach((tag) => set.add(slug(tag)));
  });

  return Array.from(set);
};

const BlogsPage = () => {
  const publishedBlogs = sortBlogs(
    allBlogs.filter((blog) => blog.isPublished)
  );

  if (!publishedBlogs.length) {
    return (
      <section className="mt-16 px-5 sm:px-10 md:px-24 sxl:px-32 text-dark dark:text-light">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Insights Are On Their Way
        </h1>
        <p className="mt-4 text-lg text-dark/70 dark:text-light/70 max-w-2xl">
          I’m curating the first batch of stories. Check back soon for deep
          dives on Next.js, Supabase, and developer experience.
        </p>
      </section>
    );
  }

  const [featured, ...others] = publishedBlogs;
  const spotlight = others.slice(0, 3);
  const archive = others.slice(3);
  const categories = buildCategoryList(publishedBlogs);

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <section className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col gap-8">
        <span className="uppercase tracking-widest text-xs sm:text-sm text-accent dark:text-accentDark">
          Knowledge hub
        </span>
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-3xl md:text-5xl lg:text-6xl leading-tight">
            Articles, playbooks, and experiments from the trenches
          </h1>
          <p className="text-base md:text-lg text-dark/70 dark:text-light/70 max-w-2xl">
            Practical guidance for developers who want to build delightful web
            experiences. Browse the library, search for a specific topic, or
            jump straight into a category below.
          </p>
        </div>
        <div className="w-full max-w-2xl">
          <BlogSearch />
        </div>
      </section>

      {featured && (
        <section className="px-5 sm:px-10 md:px-24 sxl:px-32 mt-12 grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
          <article className="xl:col-span-3">
            <h2 className="sr-only">Featured article</h2>
            <BlogLayoutOne blog={featured} />
          </article>
          <div className="xl:col-span-2 flex flex-col gap-8">
            <h2 className="text-xl font-semibold">Spotlight stories</h2>
            <div className="flex flex-col gap-6">
              {spotlight.map((blog) => (
                <BlogLayoutThree key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 sm:px-10 md:px-24 sxl:px-32 mt-16">
        <h2 className="text-xl font-semibold mb-4">Browse by topic</h2>
        <Categories categories={categories} currentSlug="all" />
      </section>

      {archive.length > 0 && (
        <section className="px-5 sm:px-10 md:px-24 sxl:px-32 mt-16 sm:mt-20 md:mt-24 space-y-12">
          <h2 className="text-xl font-semibold">Latest deep dives</h2>
          {archive.map((blog) => (
            <article key={blog._id}>
              <BlogLayoutTwo blog={blog} />
            </article>
          ))}
        </section>
      )}
    </article>
  );
};

export default BlogsPage;
