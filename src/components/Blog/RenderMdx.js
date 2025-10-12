'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { slug } from 'github-slugger';

const mdxComponents = {
  Image,
};

const RenderMdx = ({ blog, onTocUpdate }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const processContent = async () => {
      try {
        // Extract headings for TOC from Markdown content
        const headings = [];
        const lines = blog.content.split('\n');

        lines.forEach((line, index) => {
          // Look for Markdown headings (##, ###, etc.)
          const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
          if (headingMatch) {
            const level = headingMatch[1].length;
            const text = headingMatch[2].trim();
            const slugText = slug(text);

            headings.push({
              level: level.toString(),
              text: text,
              slug: slugText,
            });
          }
        });

        // Update TOC in parent component
        if (onTocUpdate && headings.length > 0) {
          onTocUpdate(headings);
        }

        const processedContent = await remark()
          .use(remarkGfm)
          .use(remarkHtml, { sanitize: false })
          .process(blog.content);

        let html = processedContent.toString();

        // Add IDs to headings for TOC navigation
        html = html.replace(
          /<h([1-6])>(.*?)<\/h[1-6]>/g,
          (match, level, content) => {
            const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
              .replace(/\s+/g, '-') // Replace spaces with hyphens
              .replace(/-+/g, '-') // Replace multiple hyphens with single
              .trim();

            return `<h${level} id="${id}">${content}</h${level}>`;
          }
        );

        setHtmlContent(html);
      } catch (error) {
        console.error('Error processing MDX content:', error);
        setHtmlContent(blog.content);
      }
    };

    processContent();
  }, [blog.content, onTocUpdate]);

  return (
    <div
      className='col-span-12  lg:col-span-8 font-in prose sm:prose-base md:prose-lg max-w-max
    prose-blockquote:bg-accent/20 
    prose-blockquote:p-2
    prose-blockquote:px-6
    prose-blockquote:border-accent
    prose-blockquote:not-italic
    prose-blockquote:rounded-r-lg

    prose-li:marker:text-accent

    dark:prose-invert
    dark:prose-blockquote:border-accentDark
    dark:prose-blockquote:bg-accentDark/20
    dark:prose-li:marker:text-accentDark

    first-letter:text-3xl
    sm:first-letter:text-5xl
    


    '
    >
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default RenderMdx;
