import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Categories.scss";

import SearchBar from "../../../components/searchbar/searchbar.jsx";
import FullNavbar from "../../../components/navbar/full_navbar/FullNavbar.jsx";
import GenericCard from "../../../components/cards/generic_card/GenericCard.jsx";
import UploadImage from "../../../components/buttons/upload_image/uploadImage.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import Loading from "../../../components/loading/loading.jsx";

import fetchData from "../../../functions/fetchData";
import fetchUser from "../../../functions/fetchUser.jsx";
import crearNotificacion from "../../../functions/createNofiticacion.jsx";

import Modal from "../../../components/modals/Modal.jsx";
import { Breadcrumb, Form } from "react-bootstrap";
import postData from "../../../functions/postData.jsx";
import defaultImage from "../../../assets/no_image.png";

function Categories() {
  const navigate = useNavigate();
  const { stockId } = useParams();
  const token = Cookies.get("token");
  const [user, setUser] = useState({});

  const [categories, setCategories] = useState([]);
  const [currentObra, setCurrentObra] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [obra, setObra] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [orderCriteria, setOrderCriteria] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    imagen: null,
    nombre: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
  });

  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
  });

  const fetchDataAsync = async () => {
    const userData = await fetchUser(navigate);
    setUser(userData);

    try {
      const categoriesResult = await fetchData("/categoria/", token);
      setCategories(categoriesResult);

      const stockResult = await fetchData(`/stock/${stockId}`, token);
      setCurrentObra(stockResult[0].id_obra.nombre);

      if (userData.is_superuser) {
        const obrasResult = await fetchData("/obra/", token);
        const filteredResult = obrasResult.filter(
          (item) => item.id_obra === stockResult[0].id_obra.id_obra,
        );
        setObra(filteredResult[0]);
      } else {
        const obrasResult = await fetchData(
          `/user/obrasToken/${token}/`,
          token,
        );
        const filteredResult = obrasResult.filter(
          (item) => item.id_obra === stockResult[0].id_obra.id_obra,
        );
        setObra(filteredResult[0]);
      }

      const img = new Image();
      img.src = defaultImage;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const file = new File([blob], "no_image.png", { type: "image/png" });
          setFormData((prevData) => ({ ...prevData, imagen: file }));
        });
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAsync();
  }, [token, navigate, stockId]);

  const filteredCategories = categories.filter((category) => {
    return (
      category.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!orderCriteria) return 0;
    const aValue = a[orderCriteria];
    const bValue = b[orderCriteria];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return bValue - aValue;
    }

    return 0;
  });

  const filters = [
    { type: "nombre", label: "Nombre Alfabético" },
    { type: "cantidad_productos", label: "Cantidad de Productos" },
  ];

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    let valid = true;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });

    if (
      formData.imagen === null ||
      formData.nombre === "" ||
      formData.descripcion === ""
    ) {
      valid = false;
    }

    setIsFormValid(valid);

    if (name === "nombre") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nombre: "El nombre no puede estar vacio.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, nombre: "" }));
      }
    } else if (name === "descripcion") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          descripcion: "La descripción no puede estar vacia.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, descripcion: "" }));
      }
    }
  };

  const newcategory = async () => {
    if (!formData.imagen) {
      console.error("No image file selected");
      return false;
    }

    const data = new FormData();
    data.append("imagen", formData.imagen);
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);

    try {
      await postData("/crear_categoria/", data, token);
      const fechaCreacion = new Date().toISOString().split("T")[0];

      const dataNotificacion = {
        titulo: "Nueva Categoría",
        descripcion: `Se creo una nueva categoría '${formData.nombre}' en la obra ${obra.nombre}.`,
        id_usuario: user.id_usuario,
        fecha_creacion: fechaCreacion,
      };

      await crearNotificacion(dataNotificacion, token, "Obra", obra.id_obra);
      setPopupData({
        title: "Categoría Creada",
        message: `La categoría ${formData.nombre} ha sido creada con éxito.`,
      });
      return true;
    } catch (error) {
      console.error("Error creating category:", error);
      setPopupData({
        title: "Error",
        message: "Ha ocurrido un error al crear la categoría.",
      });
      return false;
    } finally {
      fetchDataAsync();
    }
  };

  const handleFileChange = (file) => {
    setFormData((prevsetFormData) => ({
      ...prevsetFormData,
      imagen: file,
    }));
  };

  return (
    <div>
      <FullNavbar selectedPage="Stock" />
      <div className="margen-arriba">
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
              <Breadcrumb.Item href="/stock">Stock</Breadcrumb.Item>
              <Breadcrumb.Item active>{currentObra}</Breadcrumb.Item>
            </Breadcrumb>
            <SearchBar
              onSearchChange={handleSearchChange}
              onOrderChange={setOrderCriteria}
              filters={filters}
            />
            {(!obra.id_tipousuario || obra.id_tipousuario === 2) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "2rem",
                  marginTop: "2rem",
                }}
              >
                <Modal
                  openButtonText="Añadir una categoria nueva"
                  openButtonWidth="15"
                  title="Crear Categoria"
                  saveButtonText="Crear"
                  handleSave={newcategory}
                  saveButtonEnabled={isFormValid}
                  content={
                    <div>
                      <h2 className="centered"> Nueva Categoria </h2>
                      <UploadImage
                        wide="13"
                        titulo="Imagen del Producto"
                        onFileChange={handleFileChange}
                        defaultImage={defaultImage}
                      />
                      <Form.Label
                        className="font-rubik"
                      >
                        Nombre de la categoría:
                      </Form.Label>
                      <Form.Control
                        name="nombre"
                        type="text"
                        placeholder="Nombre"
                        onBlur={handleInputChange}
                        onChange={handleInputChange}
                        style={{
                          borderRadius: "10rem",
                          backgroundColor: "#F5F5F5",
                          boxShadow:
                            "0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)",
                          marginTop: "0.2rem", marginBottom: "0.7rem"
                        }}
                      />
                      <Form.Label
                        id="errorNombre"
                        style={{
                          marginBottom: "0px",
                          fontSize: "0.8rem",
                          color: "red",
                        }}
                      >
                        {errors.nombre}
                      </Form.Label>
                      <Form.Label
                        className="font-rubik"
                      >
                        Descripción:
                      </Form.Label>
                      <Form.Control
                        name="descripcion"
                        type="text"
                        placeholder="Descripción"
                        onBlur={handleInputChange}
                        onChange={handleInputChange}
                        style={{
                          borderRadius: "10rem",
                          backgroundColor: "#F5F5F5",
                          boxShadow:
                            "0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)",
                          marginTop: "0.2rem"
                        }}
                      />
                      <Form.Label
                        id="errorDescripcion"
                        style={{
                          marginBottom: "0px",
                          fontSize: "0.8rem",
                          color: "red",
                        }}
                      >
                        {errors.descripcion}
                      </Form.Label>
                    </div>
                  }
                  showPopup={true}
                  popupTitle={popupData.title}
                  popupMessage={popupData.message}
                />
              </div>
            )}
            <div className="cardCategori">
              {Array.isArray(sortedCategories) &&
              sortedCategories.length > 0 ? (
                sortedCategories.map((category) => (
                  <GenericCard
                    onClick={() =>
                      navigate(
                        `/obra/${stockId}/categoria/${category.id_categoria}/`,
                        { state: { id_stock: stockId } },
                      )
                    }
                    foto={category.imagen}
                    key={category.id_categoria}
                    titulo={category.nombre}
                    descrip1={category.descripcion}
                  />
                ))
              ) : (
                <p style={{ marginLeft: "7rem", marginTop: "1rem" }}>
                  No hay categorías disponibles.
                </p>
              )}
            </div>
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
