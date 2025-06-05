import React, { useEffect, useState } from "react";
import api from "../../api/api";  
import { Button, Form, Tab, Table, Tabs, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUsuario, setEditedUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    verifyAccess();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchUsuarios();
    }
  }, [isAuthorized]);

  const verifyAccess = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/protected", {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      if (response.data.user.role === "Admin") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Acesso negado:", error);
      setIsAuthorized(false);
    }
    finally {
    setLoading(false); 
    }
  };

  const fetchUsuarios = async () => {
    try {
      // Buscar usuários de cada tipo
      const [responseAlunos, responseProfessores, responseAdmins] = await Promise.all([
        api.get("/user/tipo/Aluno"),
        api.get("/user/tipo/Professor"),
        api.get("/user/tipo/Admin"),
      ]);

      // Combinar as listas de usuários
      const allUsuarios = [
        ...responseAlunos.data.users,
        ...responseProfessores.data.users,
        ...responseAdmins.data.users,
      ];

      setUsuarios(allUsuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  if (loading) {
    return <div className="container mt-4"><h3>Verificando o token...</h3></div>;
  }

  if (isAuthorized === false) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Alert variant="danger" className="text-center p-4" style={{ maxWidth: "400px" }}>
          <h4>Acesso negado!</h4>
          <p>Você não tem permissão para acessar esta página.</p>
        </Alert>
      </div>
    );
  }

  const handleEdit = (id) => {
    const usuario = usuarios.find((usuario) => usuario._id === id);
    setEditingId(id);
    setEditedUsuario({ ...usuario });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUsuario({ ...editedUsuario, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/user/${editingId}`, editedUsuario);
      const updatedUsuario = response.data.user;
      setUsuarios(
        usuarios.map((usuario) =>
          usuario._id === editingId ? updatedUsuario : usuario
        )
      );
      setEditingId(null);
      setEditedUsuario({ nome: "", email: "", senha: "", tipo: "" });
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este Usuário?")) {
      try {
        await api.delete(`/user/${id}`);
        setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const renderUserTable = (tipo) => (
    <Table striped bordered hover style={{ textAlign: "center" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Senha</th>
          <th>Opções</th>
        </tr>
      </thead>
      <tbody>
        {usuarios
          .filter((usuario) => usuario.tipo === tipo)
          .map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario._id}</td>
              <td>
                {editingId === usuario._id ? (
                  <Form.Control
                    type="text"
                    name="nome"
                    value={editedUsuario.nome}
                    onChange={handleChange}
                  />
                ) : (
                  usuario.nome
                )}
              </td>
              <td>
                {editingId === usuario._id ? (
                  <Form.Control
                    type="text"
                    name="email"
                    value={editedUsuario.email}
                    onChange={handleChange}
                  />
                ) : (
                  usuario.email
                )}
              </td>
              <td>
                {editingId === usuario._id ? (
                  <Form.Control
                    type="password"
                    name="senha"
                    value={editedUsuario.senha}
                    onChange={handleChange}
                  />
                ) : (
                  "********"
                )}
              </td>
              <td>
                {editingId === usuario._id ? (
                  <>
                    <Button
                      variant="success"
                      onClick={handleSave}
                      style={{ marginRight: "5px" }}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(usuario._id)}
                      style={{ marginRight: "5px" }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(usuario._id)}
                    >
                      Excluir
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );

  return (
    isAuthorized && (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <h1>Usuários:</h1>
        <Tabs defaultActiveKey="Aluno" id="uncontrolled-tab-example">
          <Tab eventKey="Aluno" title="Alunos">{renderUserTable("Aluno")}</Tab>
          <Tab eventKey="Professor" title="Professores">{renderUserTable("Professor")}</Tab>
          <Tab eventKey="Admin" title="Administradores">{renderUserTable("Admin")}</Tab>
        </Tabs>

        <Button
          variant="primary"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
          onClick={toggleAddForm}
        >
          <span>+</span>
        </Button>
      </div>
    )
  );
};

export default Usuario;