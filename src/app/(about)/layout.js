import InsightRoll from '../../components/About/InsightRoll';

const insights = [
  '5+ Full-Stack Projects Deployed',
  'Software Engineering Graduate 🎓',
  'Focused on Next.js, React & Flask',
  'Portfolio-Driven Developer 💻',
  'Building Real-World SaaS & API Projects',
  'Passionate About Clean Code & UI Design',
  'Currently Seeking Software Engineer Roles 🚀',
  'Based in New York 🇺🇸',
];

export default function AboutLayout({ children }) {
  return (
    <main className='w-full flex flex-col items-center justify-between'>
      <InsightRoll insights={insights} />
      {children}
    </main>
  );
}
