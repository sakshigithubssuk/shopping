import React from 'react';
import Maincrasol from '../components/HomeCarosal/Maincrasol';
import HomeSectionCrasol from '../components/Homesectioncrasol/HomeSectionCrasol';
import { mens_kurta } from '../../Data/mens_kurta';
import { lehngacholiPage2 } from '../../Data/lhengacholipage2';

const HomePage = () => {
  return (
    <div>
<Maincrasol/>
   
    <div className='py-20 space-y-10 flex-col justify-center'>
      <HomeSectionCrasol data={mens_kurta} sectionName={"Men's Kurta"}/>
      <HomeSectionCrasol data={lehngacholiPage2} sectionName={"Women's Lhenga"}/>
      
    </div>
    </div>
  );
}


export default HomePage;