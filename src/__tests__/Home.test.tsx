import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../app/page';

// Mock the blog utility functions
jest.mock('../lib/blog', () => ({
  getAllBlogs: jest.fn(() => [
    {
      slug: 'test-blog-post',
      title: 'Test Blog Post',
      description: 'A test blog post description',
      publishedAt: '2023-01-01',
      updatedAt: '2023-01-01',
      author: 'Ozkan Cimenli',
      tags: ['test', 'blog'],
      url: '/blogs/test-blog-post',
      readingTime: { 
        text: '5 min read',
        minutes: 5,
        time: 300000,
        words: 1000
      },
      isPublished: true,
      content: 'Test content',
      toc: []
    },
  ]),
}));

// Mock components
jest.mock('../components/Home/HomeCoverSection', () => {
  return function MockHomeCoverSection({ blogs }: { blogs: any[] }) {
    return (
      <div data-testid='home-cover-section'>
        Home Cover Section - {blogs.length} blogs
      </div>
    );
  };
});

jest.mock('../components/Home/FeaturedPosts', () => {
  return function MockFeaturedPosts({ blogs }: { blogs: any[] }) {
    return (
      <div data-testid='featured-posts'>
        Featured Posts - {blogs.length} blogs
      </div>
    );
  };
});

jest.mock('../components/Home/RecentPosts', () => {
  return function MockRecentPosts({ blogs }: { blogs: any[] }) {
    return (
      <div data-testid='recent-posts'>Recent Posts - {blogs.length} blogs</div>
    );
  };
});

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);

    expect(screen.getByTestId('home-cover-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-posts')).toBeInTheDocument();
    expect(screen.getByTestId('recent-posts')).toBeInTheDocument();
  });

  it('passes blogs data to components', () => {
    render(<Home />);

    expect(
      screen.getByText('Home Cover Section - 1 blogs')
    ).toBeInTheDocument();
    expect(screen.getByText('Featured Posts - 1 blogs')).toBeInTheDocument();
    expect(screen.getByText('Recent Posts - 1 blogs')).toBeInTheDocument();
  });

  it('has correct main element structure', () => {
    render(<Home />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center'
    );
  });
});
