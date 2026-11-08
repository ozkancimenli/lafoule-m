import InsightRoll from '../../components/About/InsightRoll';

const insights = [
  'Founder & builder',
  'Software Engineering Graduate 🎓',
  'Next.js, React & Python',
  'Local AI production systems',
  'Procedural 3D with Blender',
  'Free tools at OmniToolset',
  'Daily illusion Shorts on YouTube',
  'Ship, measure, rebuild',
];

export default function AboutLayout({ children }) {
  return (
    <main className='w-full flex flex-col items-center justify-between'>
      <InsightRoll insights={insights} />
      {children}
    </main>
  );
}
