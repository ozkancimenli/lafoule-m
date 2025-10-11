import { slug } from "github-slugger";
import React from "react";
import Category from "./Category";

const baseClassName =
  "px-0 md:px-10 sxl:px-20 mt-10 border-t-2 text-dark dark:text-light border-b-2 border-solid border-dark dark:border-light py-4 flex items-start flex-wrap font-medium mx-5 md:mx-10";

const Categories = ({ categories, currentSlug, className }) => {
  const containerClassName = className ?? baseClassName;

  return (
    <div className={containerClassName}>
      {categories.map((cat) => (
        <Category
          key={cat}
          link={`/categories/${cat}`}
          name={cat}
          active={currentSlug === slug(cat)}
        />
      ))}
    </div>
  );
};

export default Categories;
