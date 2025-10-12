'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
// Blog data will be fetched from API

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BlogStats = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    recentComments: [],
    popularBlogs: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get blog stats from API
      const blogResponse = await fetch('/api/blogs');
      const blogs = blogResponse.ok ? await blogResponse.json() : [];
      const publishedBlogs = blogs.filter(blog => blog.isPublished);

      // Get comment stats
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*');

      if (commentsError) throw commentsError;

      const pendingComments = comments.filter(c => !c.is_approved).length;
      const approvedComments = comments.filter(c => c.is_approved).length;

      // Get subscriber stats
      const { data: subscribers, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('*');

      if (subscribersError) throw subscribersError;

      const activeSubscribers = subscribers.filter(s => s.is_active).length;

      // Get recent comments
      const { data: recentComments, error: recentCommentsError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentCommentsError) throw recentCommentsError;

      // Calculate popular blogs (by comment count)
      const blogCommentCounts = {};
      comments.forEach(comment => {
        blogCommentCounts[comment.blog_slug] = (blogCommentCounts[comment.blog_slug] || 0) + 1;
      });

      const popularBlogs = Object.entries(blogCommentCounts)
        .map(([slug, count]) => {
          const blog = blogs.find(b => b.slug === slug);
          return blog ? { ...blog, commentCount: count } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.commentCount - a.commentCount)
        .slice(0, 5);

      setStats({
        totalBlogs: publishedBlogs.length,
        totalComments: comments.length,
        pendingComments,
        approvedComments,
        totalSubscribers: subscribers.length,
        activeSubscribers,
        recentComments: recentComments || [],
        popularBlogs
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Blog Statistics
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📝</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Blogs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.totalBlogs}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💬</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Comments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.totalComments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Comments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.pendingComments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📧</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Subscribers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.activeSubscribers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Comments */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Comments
          </h3>
          {stats.recentComments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentComments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{comment.author_name}</span> - {comment.blog_slug}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(comment.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Blogs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Popular Blogs
          </h3>
          {stats.popularBlogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {stats.popularBlogs.map((blog, index) => (
                <div key={blog.slug} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {blog.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {blog.tags.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {blog.commentCount} comments
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogStats;
