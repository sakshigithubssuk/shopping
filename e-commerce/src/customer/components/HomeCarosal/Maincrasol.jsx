import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { maincrasolData } from './MaincrasolData';
import '../../../App.css';

const Maincrasol = () => {
  const items = maincrasolData.map((item) => (
    <div key={item.image} className="carousel-item">
      <img className="crasol-img" src={item.image} alt="" />
    </div>
  ));

  return (
    <AliceCarousel
      items={items}
      disableButtonsControls
      autoPlay
      autoPlayInterval={1000}
      infinite
    />
  );
};

export default Maincrasol;