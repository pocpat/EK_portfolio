import React, { useState, useEffect } from "react";
import "../css/App.css";
import PdfModal from "./pdfModal/PdfModal";
import { Col, Button } from "react-bootstrap";
import { supabase } from '../supabaseClient';

export const ProjectCard = ({ title, description, imgUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [hardcodedPdfUrl, setHardcodedPdfUrl] = useState("/metroge_vert.pdf");
  const [hardcodedPdfUrl2, setHardcodedPdfUrl2] = useState("/SimilarCarsFinder.pdf");

  const handleOpenPdfModal = () => {
    setShowModal(true);
  };

  // Fetch project-specific PDF URLs from Supabase
  useEffect(() => {
    const fetchProjectPdfs = async () => {
      try {
        const { data, error } = await supabase
          .from('pdfs')
          .select('title, file_url')
          .in('title', ['metroge_vert.pdf', 'SimilarCarsFinder.pdf']);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          data.forEach(pdf => {
            if (pdf.title === 'metroge_vert.pdf') {
              setHardcodedPdfUrl(pdf.file_url);
            } else if (pdf.title === 'SimilarCarsFinder.pdf') {
              setHardcodedPdfUrl2(pdf.file_url);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching project PDFs:', error);
        // Keep the fallback values already set in state
      }
    };

    fetchProjectPdfs();
  }, []);

  return (
    <Col sm={6} md={4} lg={4}>
      <div className="proj-imgbx">
        <img src={imgUrl} alt="img" />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
          <br />
          <div className="project-card-buttons">
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
              Personal-Portfolio
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
            <div className="proj__buttons-container">
              <Button
                href="https://cook-it-up-ek.web.app/"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </Button>
              <Button
              href="https://github.com/pocpat/cookitup"
               className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </div>
          )}

          {title === "MetroGE" && (
            <div className="proj__buttons-container">
              <Button
                href="https://github.com/pocpat/metroje"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
              <Button
                onClick={handleOpenPdfModal}
                className="project-card-button"
              >
                PDF
              </Button>
              {showModal && (
                <PdfModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  file={hardcodedPdfUrl}
                />
              )}
            </div>
          )}
          {title === "Similar Car Finder" && (
            <div className="proj__buttons-container">
              <Button
                href="https://github.com/pocpat/similar-cars/"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
              <Button
                onClick={handleOpenPdfModal}
                className="project-card-button"
              >
             PDF
              </Button>
              {showModal && (
                <PdfModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  file={hardcodedPdfUrl2}
                />
              )}
            </div>
          )}
          {title === "EK-Summize" && (
            <div className="proj__buttons-container">
              <Button
                href="https://curious-kelpie-5a8405.netlify.app/"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </Button>
              <Button
                href="https://github.com/pocpat/EK-Summize"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </div>
          )}
          {title === "EK-CarShowcase" && (
            <div className="proj__buttons-container">

              <Button
                href="https://github.com/pocpat/EK-CarShowcase"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </div>
          )}
          {title === "Next.js aps structure" && (
            <div>
              <a
                href="https://www.youtube.com/@javascriptmastery"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
              JavaScript Mastery

              </a>
              by
              <a
                href="https://www.jsmastery.pro/"
                className="text-underline font-size-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
              Adrian Hajdin

              </a>
            </div>
          )}
          {title === "Big O Brain Bender" && (
            <div className="proj__buttons-container">
              <Button
                href="https://big-o-game.vercel.app/"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </Button>
              <Button
                href="https://github.com/pocpat/BigO-game"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </div>
          )}
           {title === "Built with Bolt" && (
            <div className="proj__buttons-container">
              <Button
                href="https://bolt.new"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </Button>
              <Button
                href="https://github.com/pocpat/EK_portfolio"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </div>
          )}
           {title === "SunSip" && (
            <div className="proj__buttons-container">
              <Button
                href="https://sunsip.netlify.app/"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </Button>
              <Button
                href="https://github.com/pocpat/sunsip"
                className="project-card-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </Col>
  );
};