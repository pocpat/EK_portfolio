import React, { useState } from "react";
import "./projModal.css";

const ProjModal = ({ title, description, onClose }) => {
  const [modalClass, setModalClass] = useState(""); 
  const [isModalActive, setIsModalActive] = useState(false); 

  // Function to handle button click and set the modal class based on buttonId
  const handleButtonClick = (buttonId) => {
    setModalClass(buttonId, "full-screen");
    setIsModalActive(true); 
  };

  // Function to close the modal
  const handleModalClick = () => {
    setModalClass("out one");

    
    // Wait for the animation to finish before removing modal from DOM
    setTimeout(() => {
      setIsModalActive(false); 
    //onClose(); // Optionally call the onClose prop if needed
    }, 1000); 
  };

  return (
    <div>
      <div className="buttons">
      
        <div onClick={() => handleButtonClick("one")} className="button">MORE INFO</div>
       
      </div>

      {/* Conditionally render the modal if active */}
      {isModalActive && (
        <div id="modal-container" className={modalClass}>
          <div className="modal-background" onClick={handleModalClick}>
            <div className="modal" 
            >
              <h2>{title}</h2>
              <p>{description}</p>
              <svg
                className="modal-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
              >
                <rect
                  x="0"
                  y="0"
                  fill="none"
                  width="226"
                  height="162"
                  rx="3"
                  ry="3"
                ></rect>
              </svg>
              <button className="button" onClick={handleModalClick}>Close Modal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjModal;

// import React, { useState, useEffect } from "react";
// import "./projModal.css";


// const ProjModal = ({ title, description, onClose }) => {
//   const [modalClass, setModalClass] = useState("");
//   useEffect(() => {
//     setModalClass("one");
//   }, []);
 

//   const handleCloseButtonClick = () => {
//     setModalClass("out closing");
  
   
//       onClose();
    
//   };

//   return (
//     <div id="modal-container" className={modalClass}>
//       <div className="modal-background">
//         <div className="modal">
//           <h2>{title}</h2>
//           <p>{description}</p>
//           <button className="button"  onClick={handleCloseButtonClick}>Close Modal</button>
//           <svg
//             className="modal-svg"
//             xmlns="http://www.w3.org/2000/svg"
//             width="100%"
//             height="100%"
//             preserveAspectRatio="none"
//           >
//             <rect
//               x="0"
//               y="0"
//               fill="none"
//               width="226"
//               height="162"
//               rx="3"
//               ry="3"
//             ></rect>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjModal;
