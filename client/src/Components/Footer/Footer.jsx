// Complete code
// Code written by Harman

import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; {currentYear} Curtis Bonham, Lorena Longoria, Erik Voss, Essence Jackson, Jackie Luu, Landon Spencer, Michael Thomas, Tyson Butler-Currier, and Harman Gidda. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;