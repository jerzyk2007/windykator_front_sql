import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import "./WindykacjaLoading.css";

const WindykacjaLoading = () => {
  const word = "WINDYKACJA".split("");

  return (
    <section className="loading-page-clean">
      <div className="loading-wrapper">
        <h1 className="loading-title">Proszę czekać ...</h1>
        <div className="letter-container">
          {word.map((letter, index) => (
            <div
              className="letter-cube"
              key={index}
              style={{ "--delay": `${index * 0.15}s` }}
            >
              <div className="cube-inner">
                <div className="cube-face front">{letter}</div>
                <div className="cube-face top">
                  <FontAwesomeIcon icon={faSnowflake} />
                </div>
                <div className="cube-face back">
                  <FontAwesomeIcon icon={faSnowflake} />
                </div>
                <div className="cube-face bottom">
                  <FontAwesomeIcon icon={faSnowflake} />
                </div>
                <div className="cube-face left"></div>
                <div className="cube-face right"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WindykacjaLoading;
