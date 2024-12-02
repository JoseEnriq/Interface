import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

const ModeloPage = () => {
  const [modelos, setModelos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    anoModelo: "",
    qtModelo: "",
    categoriaId: "",
    marcaId: "",
  });
  const [editingModelo, setEditingModelo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch data on load
  useEffect(() => {
    fetchModelos();
  }, []);

  const fetchModelos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/modelo");
      setModelos(response.data);
    } catch (error) {
      setErrorMessage("Erro ao carregar os modelos.");
    }
  };

  const handleShowModal = (modelo = null) => {
    if (modelo) {
      setEditingModelo(modelo.id);
      setFormData({
        nome: modelo.nome,
        anoModelo: modelo.anoModelo,
        qtModelo: modelo.qtModelo,
        categoriaId: modelo.categoriaId,
        marcaId: modelo.marcaId,
      });
    } else {
      setEditingModelo(null);
      setFormData({
        nome: "",
        anoModelo: "",
        qtModelo: "",
        categoriaId: "",
        marcaId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (editingModelo) {
        // Update existing modelo
        await axios.put(`http://localhost:3000/modelo/${editingModelo}`, formData);
      } else {
        // Create new modelo
        await axios.post("http://localhost:3000/modelo", formData);
      }
      fetchModelos();
      handleCloseModal();
    } catch (error) {
      setErrorMessage("Erro ao salvar o modelo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/modelo/${id}`);
      fetchModelos();
    } catch (error) {
      setErrorMessage("Erro ao deletar o modelo.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gerenciamento de Modelos</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Adicionar Modelo
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ano</th>
            <th>Quantidade</th>
            <th>Categoria ID</th>
            <th>Marca ID</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {modelos.map((modelo) => (
            <tr key={modelo.id}>
              <td>{modelo.id}</td>
              <td>{modelo.nome}</td>
              <td>{modelo.anoModelo}</td>
              <td>{modelo.qtModelo}</td>
              <td>{modelo.categoriaId}</td>
              <td>{modelo.marcaId}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShowModal(modelo)}
                >
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(modelo.id)}
                >
                  Deletar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Adding/Editing Modelo */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingModelo ? "Editar Modelo" : "Adicionar Modelo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ano do Modelo</Form.Label>
              <Form.Control
                type="number"
                name="anoModelo"
                value={formData.anoModelo}
                onChange={handleInputChange}
                placeholder="Digite o ano do modelo"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                name="qtModelo"
                value={formData.qtModelo}
                onChange={handleInputChange}
                placeholder="Digite a quantidade"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria ID</Form.Label>
              <Form.Control
                type="number"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleInputChange}
                placeholder="Digite o ID da categoria"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Marca ID</Form.Label>
              <Form.Control
                type="number"
                name="marcaId"
                value={formData.marcaId}
                onChange={handleInputChange}
                placeholder="Digite o ID da marca"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModeloPage;