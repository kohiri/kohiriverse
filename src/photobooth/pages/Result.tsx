import React, { useRef, useState, useEffect} from "react";
import "./Result.css";
import "./styles.css"
import { href, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import HouseIcon from "../../assets/images/house-solid.svg?react";
import { jsPDF } from "jspdf";
import { error, time } from "console";
import printIcon from "../../assets/images/print_icon.png"

import ShareIcon from "../../assets/images/share-icon.svg?react";

const Result: React.FC = () => {
  const { state } = useLocation();
  const photos: string[] = state?.photos ?? [];
  const bgStyle = state?.bgStyle ?? { background: "#000" }; // fallback background
  const timestamp = state?.timestamp ?? "";
  const showTimestamp: boolean = state?.showTimestamp ?? false;
  const caption: string = state?.caption ?? "";

  const comboRef = useRef<HTMLDivElement>(null);

  // return home
  const navigate = useNavigate();
  const handleReturnHome = () => {
    navigate("/photobooth/home");
  };

  // common helper fot download and share
  const generatePDF = async (): Promise<string> => {
    if (!comboRef.current) {
      throw new Error("Nothing to capture");
    }

    const el = comboRef.current;
    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 2,
    })
    return canvas.toDataURL("image/png");
  }

  // download
  const handleDownload = async () => {
    if (!comboRef.current) return;
    try {
      const imageURL = await generatePDF();
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "yourphotostrip";
      link.click();
    } 
    catch (err) { console.error("Download Failed", err); }
  };

  // share 
  const handleShare = async () => {
    try {
      const dataUrl = await generatePDF();
      const res  = await fetch(dataUrl);
      const blob = await res.blob();

      const file = new File([blob], "youresopretty.png", { type: blob.type });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: "Check this out!",
        });
      } else {
        // fallback: copy a blob:// URL for the user to paste
        const url = URL.createObjectURL(blob);
        await navigator.clipboard.writeText(url);
        alert("Image link copied to clipboard!");
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  }

  // save

  const [showSaveModal, setShowSaveModal] = useState(false);
  const handleSaveClick = async () => {
    if (!comboRef.current) {
      alert("Nothing to save!");
      return;
    };
    const canvas = await html2canvas(comboRef.current, {
      width: comboRef.current.offsetWidth, // Get the rendered width
      height: comboRef.current.offsetHeight,
    });
    const imageData = canvas.toDataURL("image/png");
    alert("I'm in the handleSaveClick function");
    try {
      const response = await fetch("api/save-photostrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageData,
          caption,
          timestamp,
        })
      })
      if (response.ok) {
        setShowSaveModal(true);
      }
      else {
        console.error("Failed to save!");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

    const handleGoToGallery = () => {
      navigate("/photobooth/gallery"); 
    };

  // account
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setAccountName(user.accountName || user.email);
      } catch (error) {
        console.error("Error parsing user data: ", error);
      }
    }
  }, []);

    const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setAccountName("");
    setShowDropDown(false);
    navigate("/photobooth/home");

    alert("You have been logged out successfully!");
  };

  const handleToSettings = () => { };
  const handleNavigateToGallery = () => { };

  const AccountDropDown = () => (
    <div className='account-dropdown'>
      <div className='dropdown-item' onClick={handleNavigateToGallery}>My Gallery</div>
      <div className='dropdown-item' onClick={handleToSettings}>Settings</div>
      <div className='dropdown-item' onClick={handleLogOut}>Log Out</div>
    </div>
  );

  const handleOpenLogin = () => {
    
  }

  return (
    <div className="result-wrapper">
      {/* home button */}
      <div style={{display: "flex", top: "20px", left: "16px", gap: "5px", alignItems: "center", position: "absolute"}}>
        <button onClick={handleReturnHome} 
                style={{background: "transparent", border: "none", cursor: "pointer"}}> 
          <HouseIcon width={35} height={35} style={{ fill: "var(--color-pink)" }} />
        </button>

      </div>

      {/*account*/ }
      <div className="info-container">
        <button onClick={handleShare} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
          <ShareIcon className='share-icon' width={30} height={30} />
        </button>
        <button
          className="auth-button"
          onClick={isAuthenticated ? handleShowDropDown : handleOpenLogin}
        >
          <span className="auth-text" onClick={isAuthenticated ? handleShowDropDown : () => navigate('/photobooth/home')}>
          {isAuthenticated ? accountName : "Log In"}
        </span>
        {isAuthenticated && showDropDown && <AccountDropDown />}
        </button>

        
      </div>

      <div className="main-content-wrapper">
        {/* text */}
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", padding: "10px"}}>
          <img src={printIcon} alt="Print Icon" style={{width: "40px", height: "40px", marginTop: "-10px", transform: "rotate(-10deg)"}}/>
          <div style={{ fontFamily: "title font", fontSize: "40px", marginBottom: "10px" }}>Printing ...</div>
        </div>
        {/* photobooth box */}
        <div className="result-container">
          <button
            className="save-btn"
            onClick={handleSaveClick}>
            Save
          </button>

          <div className="photostrip-mask">
            <div ref={comboRef}className="photostrip-combo" style={bgStyle}>
              {photos.map((photo, index) =>
                photo ? (
                  <img
                    key={index}
                    src={photo}
                    alt={`Captured ${index}`}
                    className="individual-photo"
                  />
                ) : (
                  <div key={index} className="individual-photo placeholder">
                    Empty
                  </div>
                )
                
              )}
              {(caption || showTimestamp) && (
                <div className="footer-section">
                  {caption && <div className="caption-display">{caption}</div>}
                  {showTimestamp && <div className="timestamp">{timestamp}</div>}
                </div>
              )}
            </div>
          </div>

        </div>
        {/* share, download button */}
        <div className = "result-actions">
            <button onClick={handleDownload}>Download</button>
            <button onClick={handleShare}>Share</button>
        </div>
      </div>

   {showSaveModal && (
      <div className="save-modal-overlay">
        <div className="save-modal">
          <p>Saved to your gallery</p>
          <button onClick={handleGoToGallery}>
            Go to your gallery
          </button>
        </div>
      </div>
    )}
    </div>
  );
};

export default Result;


