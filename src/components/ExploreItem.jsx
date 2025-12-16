import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./ExploreItem.css";

export default function ExploreItem({ icon, title, desc, longInfo }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  function handleEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    setPopupPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 20 // popup above the card
    });

    setShowPopup(true);
  }

  function handleLeave() {
    setShowPopup(false);
  }

  return (
    <div
      className="explore-card"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="explore-icon">{icon}</span>
      <h3 className="explore-title">{title}</h3>
      <p className="explore-desc">{desc}</p>

      {showPopup &&
        ReactDOM.createPortal(
          <div
            className="explore-popup-portal"
            style={{
              position: "fixed",
              left: popupPos.x,
              top: popupPos.y,
            }}
          >
            <div className="popup-title">{title}</div>
            <div className="popup-body">{longInfo}</div>
          </div>,
          document.body
        )}
    </div>
  );
}
