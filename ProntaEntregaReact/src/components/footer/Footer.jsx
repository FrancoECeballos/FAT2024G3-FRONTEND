import React from 'react';
import './Footer.scss'; // Asegúrate de crear este archivo CSS
import { Icon } from '@iconify/react';

function Footer() {
  return (
    <footer className="footer-16371">
      <div className="footer-container">
        <div className="social-links">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <Icon icon="line-md:facebook" />
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <Icon icon="line-md:twitter-x" />
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <Icon icon="line-md:instagram" />
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="line-md:linkedin" />
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="line-md:github" />
            <i className="fab fa-github"></i>
          </a>
        </div>
        <div className="footer-bottom">
          <p>© 2023 Copyright: <a href="https://tu-sitio-web.com">TuSitioWeb.com</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;