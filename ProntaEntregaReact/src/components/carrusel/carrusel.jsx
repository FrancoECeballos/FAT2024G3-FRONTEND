import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './carrusel.scss';

function ControlledCarousel({foto1, foto2, foto3}) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel fade 
    activeIndex={index} 
    onSelect={handleSelect} 
    controls={false} 
    indicators={false} 
    wrap={true} 
    slide={true}
    interval={2000}>
      <Carousel.Item>
        <img 
          src={foto1} 
          style={{ 
            width: '100%', 
            height: '40rem',  
            objectFit: 'cover' 
          }} 
        />
        <Carousel.Caption>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img 
          src={foto2} 
          style={{ 
            width: '100%', 
            height: '40rem',  
            objectFit: 'cover' 
          }} 
        />
        <Carousel.Caption>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img 
          src={foto3} 
          style={{ 
            width: '100%', 
            height: '40rem',  
            objectFit: 'cover' 
          }} 
        />
        <Carousel.Caption>
            
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;