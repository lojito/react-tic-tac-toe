import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import "./About.scss";

const About: FC = () => {
  const {
    dictionary: {
      ABOUT_GAME_DEVELOPED_WITH,
      ABOUT_SOURCE_CODE,
      ABOUT_OTHER_HOME_PROJECTS,
    },
  } = useContext(DictionaryContext);

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
    {
      name: "REST API",
      url: "https://www.tutorialspoint.com/restful/index.htm/",
    },
    { name: "GraphQL", url: "https://graphql.org/" },
  ];

  const techStackLi = techStack.map(({ name, url }) => {
    return (
      <li key={name}>
        <a target="_blank" href={url} rel="noopener noreferrer">
          {name}
        </a>
      </li>
    );
  });

  const source = "https://github.com/lojito/tic-tac-toe";

  const otherProjects = [
    {
      name: "Puzzle (Angular)",
      url: "https://github.com/lojito/angular-puzzle",
    },
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
      name: "In-memory database engine (C)",
      url: "https://github.com/lojito/c_champions_league",
    },
    {
      name: "Bubble sort sorting algorithm (Assembly)",
      url: "https://github.com/lojito/assembly-bubble-sort",
    },
  ];

  const otherProjectsLi = otherProjects.map(({ name, url }) => {
    return (
      <li key={name}>
        <a target="_blank" href={url} rel="noopener noreferrer">
          {name}
        </a>
      </li>
    );
  });

  return (
    <div className="about" data-testid="about">
      <div>
        <span>{ABOUT_GAME_DEVELOPED_WITH}</span>
        <ul>{techStackLi}</ul>
      </div>
      <div>
        <span>{ABOUT_SOURCE_CODE}</span>
        <ul>
          <li>
            <a target="_blank" href={source} rel="noopener noreferrer">
              {source}
            </a>
          </li>
        </ul>
      </div>
      <span>{ABOUT_OTHER_HOME_PROJECTS}</span>
      <ul>{otherProjectsLi}</ul>
    </div>
  );
};

export default About;
