import { Col } from "react-bootstrap";
import React from "react";
import "../css/App.css";
import "./projModal/projModal.css";
import ProjModal from "./projModal/ProjModal";

export const ProjectCard = ({ title, description, imgUrl, handleModalOpen }) => {
  const handleClick = () => {
    handleModalOpen(title, description); // Pass project data to Projects.js
  };

  return (
    <Col sm={6} md={4} lg={4}>
      <div className="proj-imgbx">
        <img src={imgUrl} alt="img" />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
          <br />
          {title === "GitHub icon" && (
            <div>
              <a
                href="https://iconscout.com/icons/github"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
              by
              <a
                href="https://iconscout.com/contributors/alfredo-hernandez"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Icons by Alfredo Hernandez
              </a>
            </div>
          )}
          {title === "Buttons" && (
            <div>
              <a
                href="https://codepen.io/Gogh/pen/GRPoqQW"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Modern Button Styles - 45 CSS Only Buttons
              </a>
              by
              <a
                href="https://iconscout.com/contributors/alfredo-hernandez"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vincent Van Goggles
              </a>
            </div>
          )}
          {title === "Project structure" && (
            <div>
              <a
                href="https://github.com/judygab/web-dev-projects/tree/main/personal-portfolio"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Modern Button Styles - 45 CSS Only Buttons
              </a>
              by
              <a
                href="https://github.com/judygab"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yossijaki
              </a>
            </div>
          )}
          {title === "Text-to-img Generation" && (
            <div>
              <a
                href="https://www.adobe.com/nz/products/firefly/features/text-to-image.html"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                AI Image Generator: Create images from text.
              </a>
            </div>
          )}
          {title === "Cook It Up" && (
            <div>
              <a
                href="https://cook-it-up-ek.web.app/"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploied Link
              </a>
            </div>
          )}
          {title === "MetroGE" && (
            <div>
           <p>Proccess of the project</p> 
            <button className="modal-button" onClick={handleClick} >
            OPEN PDF INFO from GPT
          </button>
          <ProjModal title={title} description={description} />
             
             
            </div>
          )}
        </div>
      </div>

    </Col>
  );
};