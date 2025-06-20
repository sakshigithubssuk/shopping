import React, { useState, useRef } from 'react';
import AliceCarousel from 'react-alice-carousel';
import HomesectionCrad from '../HomeSectionCard/HomesectionCrad';
import { Button } from '@mui/material';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const HomeSectionCrasol = ({data,sectionName}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null); // Create a ref for AliceCarousel

  const responsive = {
    0: { items: 1 },
    720: { items: 3 },
    1024: { items: 5.5 },
  };

  const items = data.slice(0, 10).map((item, index) => (
    <HomesectionCrad key={index} product={item} />
  ));

  const slidePrev = () => {
    if (activeIndex > 0) {
      carouselRef.current.slidePrev(); // Use carouselRef to move slides
    }
  };

  const slideNext = () => {
    if (activeIndex < items.length - 5) {
      carouselRef.current.slideNext(); // Use carouselRef to move slides
    }
  };

  const syncActiveIndex = (event) => {
    setActiveIndex(event.item);
  };

  return (
    <div className="px-4 lg:px-8 border z-10">
      <h2 className='text-2xl front-extrabold text-gray-800 py-5'>{sectionName}</h2>
      <div className="relative p-5">
        <AliceCarousel
          ref={carouselRef} // Attach ref to carousel
          items={items}
          disableButtonsControls
          disableDotsControls
          responsive={responsive}
          onSlideChanged={syncActiveIndex}
          activeIndex={activeIndex} // Bind state correctly
        />

        {/* Right Button */}
        {activeIndex < items.length - 5 && (
          <Button
            variant="contained"
            className="z-50 bg-white"
            onClick={slideNext} // Call slideNext function
            sx={{
              position: 'absolute',
              top: '8rem',
              right: '0rem',
              transform: 'translateX(50%) rotate(90deg)',
              bgcolor: 'white',
            }}
            aria-label="next"
          >
            <KeyboardArrowLeftIcon sx={{ transform: 'rotate(90deg)', color: 'black' }} />
          </Button>
        )}

        {/* Left Button */}
        {activeIndex > 0 && (
          <Button
            onClick={slidePrev} // Call slidePrev function
            variant="contained"
            className="z-50 bg-white"
            sx={{
              position: 'absolute',
              top: '8rem',
              left: '0rem',
              transform: 'translateX(-50%) rotate(90deg)',
              bgcolor: 'white',
            }}
            aria-label="prev"
          >
            <KeyboardArrowLeftIcon sx={{ transform: 'rotate(90deg)', color: 'black' }} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeSectionCrasol;
