import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/theme.css";

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const isAdmin = localStorage.getItem("admin") === "true";

  useEffect(() => {
    const handleResize = () => {
      const shouldBeMobile = window.innerWidth <= 992;
      setIsMobile(shouldBeMobile);

      // Cerrar menú móvil si cambiamos a desktop
      if (!shouldBeMobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo y marca */}
        <div className="navbar-brand">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
        </div>

        {!isAdmin && !isMobile && (
          <>
          <div className="desktop-menu">
            <NavLink to="/home" className="nav-button">
              Inicio
            </NavLink>
            <NavLink to="/sales" className="nav-button">
              Ventas
            </NavLink>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>

          </>
        )}

        {/* Menú desktop - solo visible en pantallas grandes */}
        {!isMobile && isAdmin &&(
          <div className="desktop-menu">
            <NavLink to="/home" className="nav-button">
              Inicio
            </NavLink>
            <NavLink to="/sales" className="nav-button">
              Ventas
            </NavLink>
            <NavLink to="/inventory" className="nav-button">
              Inventario
            </NavLink>
            <NavLink to="/staff" className="nav-button">
              Personal
            </NavLink>
            <NavLink to="/prediction" className="nav-button">
              Predicción
            </NavLink>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        )}

      {/* Botón de menú hamburguesa - solo visible en móvil */}
      {isMobile && (
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}
        {isMobile && isAdmin && (
          <>
            <NavLink
              to="/inventory"
              className="mobile-nav-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Inventario
            </NavLink>
            <NavLink
              to="/staff"
              className="mobile-nav-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Personal
            </NavLink>
            <NavLink
              to="/prediction"
              className="mobile-nav-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Predicción
            </NavLink>
          </>
        )}
      </nav>

      {/* Menú móvil - solo visible cuando está activo y en móvil */}
      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
          <NavLink
            to="/home"
            className="mobile-nav-button"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/sales"
            className="mobile-nav-button"
            onClick={() => setIsMenuOpen(false)}
          >
            Ventas
          </NavLink>
          <NavLink
            to="/inventory"
            className="mobile-nav-button"
            onClick={() => setIsMenuOpen(false)}
          >
            Inventario
          </NavLink>
          <NavLink
            to="/staff"
            className="mobile-nav-button"
            onClick={() => setIsMenuOpen(false)}
          >
            Personal
          </NavLink>
          <NavLink
            to="/prediction"
            className="mobile-nav-button"
            onClick={() => setIsMenuOpen(false)}
          >
            Predicción
          </NavLink>
          <button onClick={handleLogout} className="mobile-logout-button">
            Cerrar Sesión
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
