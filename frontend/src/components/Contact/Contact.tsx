import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import "./Contact.scss";

const Contact: FC = () => {
  const { dictionary } = useContext(DictionaryContext);

  const contact = {
    author: "Livan Ojito Villanueva",
    email: "livanojito@gmail.com",
    github: "https://github.com/lojito",
    linkedin: "https://ca.linkedin.com/in/livan-ojito",
  };

  return (
    <div className="contact" data-testid="contact">
      <p>
        <span>{dictionary.CONTACT_AUTHOR} </span>
        <span className="me">{contact.author}</span>
      </p>
      <p>
        <span>{dictionary.CONTACT_EMAIL} </span>
        <span className="me">{contact.email}</span>
      </p>
      <p>
        <span>{dictionary.CONTACT_GITHUB} </span>
        <a target="_blank" href={contact.github} rel="noopener noreferrer">
          {contact.github}
        </a>
      </p>
      <p>
        <span>{dictionary.CONTACT_LINKEDIN} </span>
        <a target="_blank" href={contact.linkedin} rel="noopener noreferrer">
          {contact.linkedin}
        </a>
      </p>
    </div>
  );
};

export default Contact;
