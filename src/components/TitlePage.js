import React from 'react'
import TitleHeader from './TitleHeader'
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'


import { useState, useEffect } from 'react';

const TitlePage =()=> {

  const [showForm, setShowForm] = useState(false);

  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');







  return (
  <>
    <TitleHeader className = "mt-0"/>
    <div className='m-0'>
    
    <Carousel>
      
      <Carousel.Item>
        <img
          className="d-block mx-auto"
          style={{ width: '800px', height: '800px'}}
          src="https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81m0KC4Df6L._RI_.jpg"

          
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block mx-auto"
          style={{ width: '800px', height: '800px'}}
          src = "https://pbs.twimg.com/media/FmaKTIJacAEGaxv.jpg:large"
          alt="Second slide"
        />

       
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block mx-auto"
          style={{ width: '800px', height: '800px'}}
          src="https://posterspy.com/wp-content/uploads/2022/07/22-07-2022.jpg"
          alt="Third slide"
        />

        
      </Carousel.Item>
    </Carousel>

    </div>




  </>
    
  )
}

export default TitlePage

