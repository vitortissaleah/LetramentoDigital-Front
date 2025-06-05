import React, { useState, useEffect } from "react";
import api from "../../api/api"; 
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const Cadastro = () => {
  const [newCurso, setNewCurso] = useState({
    nome: "",
    descrição: "",
    preço: "",
    imagem: "",
    video: "",
    promoção: "",
    professorId: "",
  });

  const [professores, setProfessores] = useState([]); // Todos os professores
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]); // Professores sem curso

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const response = await api.get("/user/tipo/Professor");
      const allProfessores = response.data.users;

      // Filtra professores que não estão vinculados a um curso (curso === null)
      const availableProfessores = allProfessores.filter(
        (professor) => !professor.curso 
      );

      setProfessores(allProfessores); // Retorna todos os professores
      setProfessoresDisponiveis(availableProfessores); // Retorna apenas os disponíveis
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewCurso((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/cursos", newCurso);

      if (response.status === 201) {
        alert("Curso adicionado com sucesso!");
        setNewCurso({
          nome: "",
          descrição: "",
          preço: "",
          imagem: "",
          video: "",
          promoção: "",
          professorId: "",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar Curso:", error.response?.data?.message || error.message);
      alert(`Erro ao adicionar curso: ${error.response?.data?.message || error.message}`);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-5">
            <Card.Body>
              <h2 className="text-center mb-4">Cadastro de Curso</h2>

              <Form onSubmit={handleAdd}>

                <Form.Group className="mb-3">
                  <Form.Label>Nome do Curso*</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={newCurso.nome}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição*</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descrição"
                    value={newCurso.descrição}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preço*</Form.Label>
                  <Form.Control
                    type="number"
                    name="preço"
                    value={newCurso.preço}
                    onChange={handleAddChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Promoção*</Form.Label>
                  <Form.Control
                    type="number"
                    name="promoção"
                    value={newCurso.promoção}
                    onChange={handleAddChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL da Imagem*</Form.Label>
                  <Form.Control
                    type="text"
                    name="imagem"
                    value={newCurso.imagem}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL do Vídeo</Form.Label>
                  <Form.Control
                    type="text"
                    name="video"
                    value={newCurso.video}
                    onChange={handleAddChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Professor Responsável*</Form.Label>
                  <Form.Select
                    name="professorId"
                    value={newCurso.professorId}
                    onChange={handleAddChange}
                    required
                  >
                    <option value="">Selecione um professor...</option>
                    {professoresDisponiveis.map((professor) => (
                      <option key={professor._id} value={professor._id}>
                        {professor.nome} {/* Mostra apenas professores sem curso */}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Adicionar
                </Button>
                <Button
                  variant="secondary"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                  }}
                >
                  Cancelar
                </Button>
              </Form>

              {newCurso.imagem && (
                <div className="mt-4">
                  <h5>Pré-visualização da Imagem:</h5>
                  <img
                    src={newCurso.imagem}
                    alt="Imagem do Curso"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              )}

              {newCurso.video && (
                <div className="mt-4">
                  <h5>Pré-visualização do Vídeo:</h5>
                  <iframe
                    width="100%"
                    height="315"
                    src={getYouTubeEmbedUrl(newCurso.video)}
                    title="Vídeo do Curso"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cadastro;