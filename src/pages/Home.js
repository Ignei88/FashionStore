// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import "../styles/theme.css";

const Home = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
  const [ventasHoy, setVentasHoy] = useState(null);
  const [loading, setLoading] = useState(true);

  const carouselItems = [
    {
      title: "Bienvenido al Sistema",
      description: "Gestión integral de inventario y ventas",
      image: "./ban1.png",
    },
    {
      title: "Control de Inventario",
      description: "Mantén un registro preciso de tus productos",
      image: "./ban2.png",
    },
    {
      title: "Análisis Predictivo",
      description: "Pronósticos de ventas basados en datos históricos",
      image: "./ban3.png",
    },
  ];

  useEffect(() => {
    const fetchVentasHoy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/ventas/ventas/hoy`);
        if (!response.ok) throw new Error("Error al obtener ventas de hoy");
        const data = await response.json();
        setVentasHoy(data);
        console.log("Ventas de hoy:", data);
      } catch (err) {
        console.error("Error al cargar ventas de hoy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentasHoy();
  }, [apiUrl]);

  return (
    <div className="container">
      <Carousel className="carousel">
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={item.image} alt={item.title} />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      
      <div className="row center mb-4">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Ventas Hoy</h5>
              {loading ? (
                <p className="display-4">Cargando...</p>
              ) : (
                <p className="display-4">
                  {loading
                    ? "Cargando..."
                    : Array.isArray(ventasHoy) && ventasHoy.length > 0
                    ? `$${ventasHoy[0].total_vendido}`
                    : "$0"}
                </p>
              )}
            </div>
          </div>
        </div>
        {/** 
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Productos en Stock</h5>
              <p className="display-4">145</p>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default Home;
