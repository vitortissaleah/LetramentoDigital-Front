import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; 
import "../assets/css/Cursos.css";
import "../assets/css/styles.css";
import logo from "../assets/images/logo.png";
import userGabigol from "../assets/images/userGabigol.png";

function CursosLayout() {
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); 

  const [profileImage, setProfileImage] = useState(userGabigol);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Função para alternar a barra lateral (mobile)
  const handleToggle = () => {
    wrapperRef.current.classList.toggle("toggled");
  };

  // Função para trocar a foto de perfil
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        showAlertMessage("Foto de perfil atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    fileInputRef.current.click();
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role"); 
    navigate("/"); 
  };

  return (
    <div className="App">
      <div className="d-flex" id="wrapper" ref={wrapperRef}>

        <div className="bg-primary" id="sidebar-wrapper">
          <div className="sidebar-heading text-center py-4 text-white text-uppercase">
            <span className="fs-7 fw-bold align-middle">MESTRE DIGITAL</span>
          </div>

          <div className="list-group list-group-flush my-3">
            <NavLink to="/adminCursos/home" className="list-group-item list-group-item-action bg-transparent text-white">
              <i className="fas fa-tachometer-alt me-2" />
              Painel Admin
            </NavLink>
            <NavLink to="/adminCursos/cursosAdmin" className="list-group-item list-group-item-action bg-transparent text-white fw-bold">
              <i className="fas fa-comment-dots me-2" />
              Cursos
            </NavLink>
            <NavLink to="/adminCursos/usuario" className="list-group-item list-group-item-action bg-transparent text-white fw-bold">
              <i className="fas fa-support me-2" />
              Usuários
            </NavLink>

            <button className="list-group-item list-group-item-action bg-transparent text-danger fw-bold" onClick={handleLogout} style={{ border: "none", background: "none", textAlign: "left" }}>
              <i className="fas fa-power-off me-2" />
              Sair
            </button>
          </div>

          <NavLink to="/">
            <img src={logo} alt="Cursos Digitais" style={{ width: "100px", margin: "10px 60px" }} />
          </NavLink>
        </div>

        <div id="page-content-wrapper">
          <nav className="navbar navbar-expand-lg navbar-light bg-primary py-4 px-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-align-left text-white fs-4 me-3" id="menu-toggle" onClick={handleToggle} />
              <h2 className="fs-3 m-0 text-white">Painel do Admin</h2>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle second-text text-white fw-bold d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                    <div className="position-relative">
                      <img src={profileImage} alt="Avatar" className="rounded-circle me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                      <button className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1" style={{ width: "20px", height: "20px", fontSize: "10px", border: "none" }} onClick={handleEditProfile}>
                        📷
                      </button>
                    </div>
                    Judge Belligham
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#" onClick={handleEditProfile}>Trocar Foto de Perfil</a></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Sair</button></li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <div className="container-fluid px-4">
            <div className="row my-5">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="d-none" />

      {showAlert && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className="toast show" role="alert">
            <div className="toast-header">
              <strong className="me-auto">Notificação</strong>
              <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
            </div>
            <div className="toast-body">{alertMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CursosLayout;
