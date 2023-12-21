import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import "./About.scss";

const About: FC = () => {
  const { dictionary } = useContext(DictionaryContext);
  const techStack = [
    { name: "Node.js", url: "https://nodejs.org" },
    { name: "Express", url: "https://expressjs.com/" },
    {
      name: "Mongoose",
      url: "https://mongoosejs.com/docs/api.html",
    },
    {
      name: "MongoDB",
      url: "https://www.mongodb.com/docs/manual/introduction/",
    },
    { name: "Typescript", url: "https://www.typescriptlang.org/" },
    { name: "React.js", url: "https://reactjs.org/" },
    { name: "React Hooks", url: "https://reactjs.org/docs/hooks-intro.html" },
    { name: "Context API", url: "https://reactjs.org/docs/context.html" },
    {
      name: "React Testing Library",
      url: "https://testing-library.com/docs/react-testing-library/intro/",
    },
    { name: "Jest", url: "https://jestjs.io/" },
    {
      name: "HTML5",
      url: "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5",
    },
    { name: "CSS3", url: "https://www.w3.org/TR/selectors-3/" },
    { name: "SASS", url: "https://sass-lang.com/" },
  ];

  const techStackLi = techStack.map((tech) => {
    return (
      <li key={tech.name}>
        <a target="_blank" href={tech.url} rel="noopener noreferrer">
          {tech.name}
        </a>
      </li>
    );
  });

  const source = "https://github.com/lojito/tic-tac-toe";

  const otherProjects = [
    { name: "Puzzle (Angular)", url: "https://github.com/lojito/puzzle" },
    {
      name: "Matching pairs (Vue.js)",
      url: "https://github.com/lojito/matching-pairs",
    },
    {
      name: "Tic-tac-toe 4x4 (Django)",
      url: "https://github.com/lojito/django-tic-tac-toe",
    },
    {
      name: "Tic-tac-toe (Python)",
      url: "https://github.com/lojito/python-tic-tac-toe",
    },
    {
      name: "Base converter (Rust)",
      url: "https://github.com/lojito/baseconverter",
    },
    {
      name: "UEFA Champions League (C)",
      url: "https://github.com/lojito/c_champions_league",
    },
    {
      name: "Bubble sort sorting algorithm (Assembly)",
      url: "https://github.com/lojito/assembly-bubble-sort",
    },
  ];

  const gamesLi = otherProjects.map((project) => {
    return (
      <li key={project.name}>
        <a target="_blank" href={project.url} rel="noopener noreferrer">
          {project.name}
        </a>
      </li>
    );
  });

  return (
    <div className="about" data-testid="about">
      <div>
        <span>{dictionary.ABOUT_GAME_DEVELOPED_WITH}</span>
        <ul>{techStackLi}</ul>
      </div>
      <div>
        <span>{dictionary.ABOUT_SOURCE_CODE}</span>&nbsp;
        <ul>
          <li>
            <a target="_blank" href={source} rel="noopener noreferrer">
              {source}
            </a>
          </li>
        </ul>
      </div>
      <span>{dictionary.ABOUT_OTHER_HOME_PROJECTS}</span>
      <ul>{gamesLi}</ul>
    </div>
  );
};

export default About;
