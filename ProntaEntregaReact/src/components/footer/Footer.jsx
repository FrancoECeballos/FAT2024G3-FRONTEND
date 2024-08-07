import React from 'react';
import './Footer.scss'; // Asegúrate de crear este archivo CSS
import { Icon } from '@iconify/react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="social-links">
          <a href="https://www.facebook.com/manosabiertasAR/?locale=es_LA" target="_blank" rel="noopener noreferrer">
          <Icon icon="line-md:facebook" />
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://x.com/manosabiertasar" target="_blank" rel="noopener noreferrer">
          <Icon icon="line-md:twitter-x" />
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com/manosabiertas.cba/" target="_blank" rel="noopener noreferrer">
          <Icon icon="line-md:instagram" />
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/company/manos-abiertas/" target="_blank" rel="noopener noreferrer">
            <Icon icon="line-md:linkedin" />
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Fundación Manos Abiertas</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;