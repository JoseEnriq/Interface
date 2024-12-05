import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

const ModeloPage = () => {
  // Estado para armazenar a lista de modelos
  const [modelos, setModelos] = useState([]);

  // Estado para controlar a visibilidade do modal
  const [showModal, setShowModal] = useState(false);

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    anoModelo: "",
    qtModelo: "",
    categoriaId: "",
    marcaId: "",
  });

  // Estado para identificar se um modelo está sendo editado
  const [editingModelo, setEditingModelo] = useState(null);

  // Estado para armazenar mensagens de erro
  const [errorMessage, setErrorMessage] = useState("");

  // Efeito para carregar os modelos ao montar o componente
  useEffect(() => {
    fetchModelos();
  }, []);

  // Função para buscar os modelos da API
  const fetchModelos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/modelo");
      setModelos(response.data);
    } catch (error) {
      setErrorMessage("Erro ao carregar os modelos.");
    }
  };

  // Função para abrir o modal e preencher os dados (caso seja edição)
  const handleShowModal = (modelo = null) => {
    if (modelo) {
      // Configura o formulário para edição
      setEditingModelo(modelo.id);
      setFormData({
        nome: modelo.nome,
        anoModelo: modelo.anoModelo,
        qtModelo: modelo.qtModelo,
        categoriaId: modelo.categoriaId,
        marcaId: modelo.marcaId,
      });
    } else {
      // Limpa o formulário para adição de um novo modelo
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

  // Função para fechar o modal e limpar mensagens de erro
  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  // Função para lidar com as alterações no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para salvar o modelo (criar ou editar)
  const handleSave = async () => {
    try {
      if (editingModelo) {
        // Atualiza um modelo existente
        await axios.put(`http://localhost:3000/modelo/${editingModelo}`, formData);
      } else {
        // Cria um novo modelo
        await axios.post("http://localhost:3000/modelo", formData);
      }
      // Recarrega a lista de modelos
      fetchModelos();
      handleCloseModal();
    } catch (error) {
      setErrorMessage("Erro ao salvar o modelo.");
    }
  };

  // Função para deletar um modelo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/modelo/${id}`);
      // Recarrega a lista de modelos
      fetchModelos();
    } catch (error) {
      setErrorMessage("Erro ao deletar o modelo.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gerenciamento de Modelos</h2>

      {/* Exibe mensagem de erro, se houver */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* Botão para abrir o modal de adição */}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Adicionar Modelo
      </Button>

      {/* Tabela para exibir a lista de modelos */}
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
                {/* Botão para editar o modelo */}
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShowModal(modelo)}
                >
                  Editar
                </Button>{" "}
                {/* Botão para deletar o modelo */}
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

      {/* Modal para adicionar ou editar modelo */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingModelo ? "Editar Modelo" : "Adicionar Modelo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Campo de entrada para o nome */}
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

            {/* Campo de entrada para o ano do modelo */}
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

            {/* Campo de entrada para a quantidade */}
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

            {/* Campo de entrada para o ID da categoria */}
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

            {/* Campo de entrada para o ID da marca */}
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
          {/* Botão para cancelar */}
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          {/* Botão para salvar */}
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModeloPage;
