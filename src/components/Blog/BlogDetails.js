import { format, parseISO } from "date-fns";
import Link from "next/link";
import React from "react";
import { slug } from "github-slugger";
import ViewCounter from "./ViewCounter";
import SocialShare from "./SocialShare";

const BlogDetails = ({ blog, slug: blogSlug }) => {
  const tags =
    Array.isArray(blog.tags) && blog.tags.length > 0
      ? blog.tags
      : ["uncategorized"];

  return (
    <>
      <div className="px-2  md:px-10 bg-accent dark:bg-accentDark text-light dark:text-dark py-2 flex items-center justify-around flex-wrap text-lg sm:text-xl font-medium mx-5  md:mx-10 rounded-lg">
        <time className="m-3">
          {format(parseISO(blog.publishedAt), "LLLL d, yyyy")}
        </time>
        <span className="m-3">
          <ViewCounter slug={blogSlug} />
        </span>
        <div className="m-3">{blog.readingTime.text}</div>
        <div className="m-3 flex flex-wrap items-center justify-center gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/categories/${slug(tag)}`}
              className="px-3 py-1 rounded-full border border-light text-sm sm:text-base"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-2 md:px-10 mx-5 md:mx-10 mt-4">
        <SocialShare 
          title={blog.title}
          url={`/blogs/${blogSlug}`}
          description={blog.description}
        />
      </div>
    </>
  );
};

export default BlogDetails;
