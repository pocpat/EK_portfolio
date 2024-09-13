import React , {useState} from "react";
import "../css/App.css";
import PdfModal from "./pdfModal/PdfModal";
import { Col, Button} from "react-bootstrap";


export const ProjectCard = ({
  title,
  description,
  imgUrl,

}) => {
  const [showModal, setShowModal] = useState(false);
  const [pdfFile, setPdfFile] = useState("");

  const handleOpenPdfModal = (file) => {
    console.log("Modal opened");
    setPdfFile(file);
    setShowModal(true);
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
            <Button onClick={() => handleOpenPdfModal("/metroge_DOC.pdf")}>
            Open PDF File
          </Button>
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};
