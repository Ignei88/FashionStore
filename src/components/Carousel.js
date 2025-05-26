// src/components/Carousel.js
import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../styles/theme.css';

const CustomCarousel = ({ items }) => {
  return (
    <Carousel fade className="glassmorphism-effect">
      {items.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={item.image}
            alt={item.title}
          />
          <Carousel.Caption className="glassmorphism-effect p-3">
            <h3 className="cursive-font">{item.title}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;