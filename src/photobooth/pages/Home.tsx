import React, { use, useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import ShareIcon from "../../assets/images/share-icon.svg?react";
import FeedbackIcon from "../../assets/images/feedback-icon.svg?react";



interface FeedbackPromptProps {
  message: string;
  placeholder?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

function FeedbackPrompt({message, placeholder = "", onConfirm, onCancel}: FeedbackPromptProps) {
  const [value, setValue] = useState("");
  return (
    <div className='prompt-overlay'>
      <div className='prompt-box'>
        <h3 className="prompt-message">{message}</h3>
        <textarea
          className="prompt-input"
          rows={3}                    // gives you 3 text‐lines of height automatically
          placeholder="Type here…"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <div className="prompt-actions">
          <button
            className="prompt-btn prompt-confirm"
            disabled={!value.trim()}
            onClick={() => onConfirm(value)}>
            Send
          </button>
          <button className="prompt-btn prompt-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Home() {
  // account
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  // settings
  const [showSettings, setShowSettings] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [currentPwd, setCurrentPwd]   = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');

  const AccountDropDown = () => (
    <div className='account-dropdown'>
      <div className='dropdown-item' onClick={handleNavigateToGallery}>My Gallery</div>
      <div className='dropdown-item' onClick={handleToSettings}>Settings</div>
      <div className='dropdown-item' onClick={handleLogOut}>Log Out</div>
    </div>
  )

  const navigate = useNavigate();

  const handleLogOut = () => { 
    // clear authentiation data from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // reset 
    setIsAuthenticated(false);
    setAccountName("");
    setShowDropDown(false);
    navigate("/photobooth/home");



    alert("You have been logged out successfully!");
  }

  // settings
  const handleToSettings = () => {
    setShowSettings(true);
  };
  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
  };

  const handleNavigateToGallery = () => { }  
  const navigateToPhotobooth = () => { navigate('/photobooth/photobooth'); }
  const navigateToPhotostrip = () => { navigate('/photobooth/photostrip'); }

  // const handleSendFeedback = () => {
  //   const response = window.prompt("Share with us your thoughts!", "");
  //   if (response !== null) {
  //     console.log("Use feedback", response);
  //     alert("Thank you for your feedback!");
  //   }
  // }

  // LOGIN
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleOpenLogin = () => {
    setIsSignUp(false);
    setShowAuthOptions(true);
  };

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
  }

  const handleSignUpClick = () => setIsSignUp(true);
  const handleSignInClick = () => setIsSignUp(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocalLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const credentials = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('authToken', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setAccountName(data.user.accountName);
      }
      
      // Redirect to dashboard or home page
      navigate('/photobooth/home');
    } 
    catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleLocalSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();
    const confirm = formData.get("confirm")?.toString();
    const email = formData.get("email")?.toString().trim();

    if (!username || !password || !confirm || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          accountName: username, 
          birthYear: null, // optional, can leave out or add another field
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        setShowAuthOptions(false);
      } 
      else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong during registration.");
    }
};




  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setAccountName(user.accountName || user.email);
      }
      catch (error) {
        console.error("Error parsing user data: ", error);
      }
    }
  }, [])

// const handleFacebookLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, facebookProvider);
//       alert(`Welcome ${result.user.displayName}!`);
//       setShowAuthOptions(false);
//     } catch (error) {
//       console.error("Facebook login error:", error);
//       alert("Login failed. Please try again.");
//     }
//   };

  // FEEDBACK
  const [showPrompt, setShowPrompt] = useState(false);
  const handleClickFeedback = () => setShowPrompt(true);
  const handleConfirm = (text: string) => {
    console.log("User feedback", text);
    setShowPrompt(false);
  }
  const handleCancel = () => setShowPrompt(false);

  // const url = window.location.href;
  // const smsHref = `sms:?&body=${encodeURIComponent(url)}`;

  // SHARE
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          // text: "Checkout this photobooth!",
          url: window.location.href,
          title: "Checkout this photobooth 💕🫧!",
        })
      }
      catch (err) {
        console.warn("share failed", err);
      }
    }
    else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <div className="background-container">

      <div className="info-container">
        <button onClick={handleShare} style={{background: "transparent", border: "none", cursor: "pointer"}}>
          <ShareIcon
            className='share-icon'
            width={30}
            height={30}
          />
        </button>
      </div>

      {showPrompt && (
        <FeedbackPrompt
          message="Share with us your thoughts!"
          placeholder="Type here…"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showAuthOptions && (
        <div className="auth-popup-overlay">
          <div className="auth-popup">
            {isSignUp ? (
              <>
                <h3 className="auth-title">Sign Up</h3>
                <form className="auth-form" onSubmit={handleLocalSignUp}>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="auth-input"
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="auth-input"
                    required
                  />
                  <input
                    name="confirm"
                    type="password"
                    placeholder="Confirm password"
                    className="auth-input"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    className="auth-input"
                    required
                  />
                  <button type="submit" className="auth-submit">
                    Sign Up
                  </button>
                </form>



                <div className="auth-switch">
                  Have an account?{' '}
                  <button className="auth-link" onClick={handleSignInClick}>
                    Sign In
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="auth-title">Log In</h3>
                <form className="auth-form" onSubmit={handleLocalLogin}>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username or E-mail"
                    className="auth-input"
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="auth-input"
                    required
                  />
                  <button type="submit" className="auth-submit">
                    Sign In
                  </button>
                </form>



                <div className="auth-switch">
                  New user?{' '}
                  <button className="auth-link" onClick={handleSignUpClick}>
                    Sign Up
                  </button>
                </div>
              </>
            )}

            <button
              className="auth-close"
              onClick={() => setShowAuthOptions(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-overlay">
          <form className="settings-modal" onSubmit={handleSaveSettings}>
            <h2>Account Settings</h2>

            {/* Username row */}
            <div className="settings-row">
              <div className="settings-label">Username</div>

              {editingField === 'username' ? (
                <>
                  <input
                    className="settings-input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <div className="settings-row-actions">
                    <button
                      type="button"
                      className="settings-btn small"
                      onClick={() => setEditingField(null)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="settings-btn small cancel"
                      onClick={() => setEditingField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="settings-value">{username}</div>
                  <button
                    type="button"
                    className="settings-btn edit"
                    onClick={() => setEditingField('username')}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Name row */}
            <div className="settings-row">
              <div className="settings-label">Name</div>

              {editingField === 'name' ? (
                <>
                  <input
                    className="settings-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <div className="settings-row-actions">
                    <button
                      type="button"
                      className="settings-btn small"
                      onClick={() => setEditingField(null)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="settings-btn small cancel"
                      onClick={() => setEditingField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="settings-value">{name}</div>
                  <button
                    type="button"
                    className="settings-btn edit"
                    onClick={() => setEditingField('name')}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Email row */}
            <div className="settings-row">
              <div className="settings-label">Email</div>

              {editingField === 'email' ? (
                <>
                  <input
                    className="settings-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <div className="settings-row-actions">
                    <button
                      type="button"
                      className="settings-btn small"
                      onClick={() => setEditingField(null)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="settings-btn small cancel"
                      onClick={() => setEditingField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="settings-value">{email}</div>
                  <button
                    type="button"
                    className="settings-btn edit"
                    onClick={() => setEditingField('email')}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Password row */}
            <div className="settings-row">
              <div className="settings-label">Password</div>
              <div className="settings-value">••••••••</div>
              <button
                type="button"
                className="settings-btn edit"
                onClick={() => setChangingPwd(true)}
              >
                Change password
              </button>
            </div>

            {changingPwd && (
              <div className="settings-row pwd-section">
                <input
                  className="settings-input"
                  type="password"
                  placeholder="Current password"
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                />
                <input
                  className="settings-input"
                  type="password"
                  placeholder="New password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                />
                <input
                  className="settings-input"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                />
              </div>
            )}

            {/* Bottom actions */}
            <div className="settings-actions">
              <button type="submit" className="settings-btn save">
                Save all
              </button>
              <button
                type="button"
                className="settings-btn cancel"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}


      <div className='decor-container'>
        <div className="container">
          <h1 className="main-page-name ballet-font">The Photobooth</h1>
          <div className="button-container">
            <button className="button" onClick={navigateToPhotobooth}>
              <span>Take Photos</span>
            </button>
            <button className="button" onClick={navigateToPhotostrip}>
              <span>Upload Photos</span>
            </button>
            
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;


