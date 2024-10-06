import { useState } from "react";
import Cancel from "../icons/Cancel";
import Dots from "../icons/Dots";

type Props = {
  disableDelete: boolean;
  onDeleteClick: () => void;
};

function ColumnPopup({ disableDelete, onDeleteClick }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="column-buttons">
      <button
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <Dots />
      </button>
      <div
        style={{ display: showPopup ? "block" : "none" }}
        className="dots-popup-wrapper"
      >
        <div
          className="dots-popup-overlay"
          onClick={() => {
            setShowPopup(false);
          }}
        ></div>
        <div className="dots-popup">
          <button
            disabled={disableDelete}
            style={{ cursor: disableDelete ? "initial" : "pointer" }}
            onClick={() => {
              onDeleteClick();
              setShowPopup(false);
            }}
          >
            <div className="dots-popup-btn-layout">
              <div className="dots-popup-btn-text">Delete</div>
              <div>
                <Cancel />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColumnPopup;
