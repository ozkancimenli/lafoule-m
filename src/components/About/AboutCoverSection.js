import Image from 'next/image';
import React from 'react';
import profileCharacter from '../../../public/character.png';

const AboutCoverSection = () => {
  return (
    <section className='w-full md:h-[75vh] border-b-2 border-solid border-dark dark:border-light flex flex-col md:flex-row items-center justify-center text-dark dark:text-light'>
      <div className='w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center'>
        <Image
          src={profileCharacter}
          alt='ozkancimenli'
          className='w-4/5 xs:w-3/4 md:w-full h-full object-contain object-center'
          priority
          sizes='(max-width: 768px) 100vw,(max-width: 1180px) 50vw, 50vw'
        />
      </div>

      <div className='w-full md:w-1/2 flex flex-col text-left items-start justify-center px-5 xs:p-10 pb-10 lg:px-16'>
        <h1 className='font-bold text-4xl xs:text-5xl sxl:text-6xl text-center lg:text-left'>
          I build things, then run them.
        </h1>
        <p className='font-medium mt-4 text-base'>
          I&apos;m Ozkan Cimenli, a software engineer turned builder. I design
          products and the systems that keep them running: OmniToolset, a set of
          free tools that work entirely in the browser; a YouTube channel of
          optical illusions generated in Blender and narrated by local AI; and
          the private production system on a single Mac Studio that ties it all
          together.
        </p>
        <p className='font-medium mt-4 text-base'>
          My background is full-stack web development — Next.js, React and
          Python — and I still write most of the code myself. I care about
          things that work without me in the loop: fast, private tools,
          repeatable pipelines and honest numbers. This site is where I document
          what I build and what I learn along the way.
        </p>
      </div>
    </section>
  );
};

export default AboutCoverSection;
