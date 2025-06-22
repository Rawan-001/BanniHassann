import React from 'react';
import './components.css';
import logoMunicipality from '../assets/AlBaha-Municipality-White.png';
import logoHealthCity from '../assets/Banni-Hassan-Health-city-White.png';
import logoEmirate from '../assets/Emirate2.svg';

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-background-placeholder" />
      <div className="hero-nav-container">
        <div className="hero-navigation-base">
          <img src={logoMunicipality} alt="Municipality Logo" className="hero-nav-logo" />
          <img src={logoHealthCity} alt="Health City Logo" className="hero-nav-logo" />
          <img src={logoEmirate} alt="Emirate Logo" className="hero-nav-logo" />
        </div>
      </div>

      <div className="hero-content-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
        <div className="hero-content" style={{ textAlign: 'right', alignItems: 'flex-end' }}>
          <h1 className="hero-title" style={{ textAlign: 'right' }}>يهلّون بك ويرحبون</h1>
          <h2 className="hero-subtitle" style={{ textAlign: 'right' }}>أهلها وجبالها</h2>
        </div>
      </div>

      <div className="hero-scroll-indicator" />

      <div className="hero-bottom-border" style={{ marginRight: 0, marginLeft: 'auto' }} />
    </div>
  );
};

export default Hero; 