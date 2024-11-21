import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Form,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from "react-bootstrap";
import Cookies from "js-cookie";
import FullNavbar from "../../components/navbar/full_navbar/FullNavbar.jsx";
import GenericCard from "../../components/cards/generic_card/GenericCard.jsx";
import SearchBar from "../../components/searchbar/searchbar.jsx";
import UploadImage from "../../components/buttons/upload_image/uploadImage.jsx";

import fetchData from "../../functions/fetchData";
import postData from "../../functions/postData";
import putData from "../../functions/putData";
import deleteData from "../../functions/deleteData";
import fetchUser from "../../functions/fetchUser";

import SendButton from "../../components/buttons/send_button/send_button.jsx";
import crearNotificacion from "../../functions/createNofiticacion.jsx";
import Popup from "../../components/alerts/popup/Popup.jsx";

import Modal from "../../components/modals/Modal.jsx";
import ConfirmationModal from "../../components/modals/confirmation_modal/ConfirmationModal.jsx";
import defaultImage from "../../assets/no_image.png";

import "./Autos.scss";

function AutosComponent() {
  const navigate = useNavigate();
  const { obraId } = useParams();
  const token = Cookies.get("token");
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [currentObra, setCurrentObra] = useState(false);
  const [obra, setObra] = useState(false);

  const [autoModal, setAutoModal] = useState(null);
  const [deleteAutoModal, setDeleteAutoModal] = useState(null);

  const [autos, setAutos] = useState([]);
  const [maintenanceStatus, setMaintenanceStatus] = useState({});
  const [description, setDescription] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [orderCriteria, setOrderCriteria] = useState(null);
  const [formData, setFormData] = useState({
    imagen: null,
    marca: "",
    modelo: "",
    patente: "",
    kilometraje: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupTitle, setPopupTitle] = useState(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      const userData = await fetchUser(navigate);
      setUser(userData);

      try {
        await fetchAutos();

        const obraResult = await fetchData(`/obra/${obraId}`, token);
        setCurrentObra(obraResult[0].nombre);

        if (userData.is_superuser) {
          const obrasResult = await fetchData("/obra/", token);
          const filteredResult = obrasResult.filter(
            (item) => item.id_obra === parseInt(obraId, 10)
          );
          setObra(filteredResult[0]);
        } else {
          const obrasResult = await fetchData(
            `/user/obrasToken/${token}/`,
            token
          );
          const filteredResult = obrasResult.filter(
            (item) => item.id_obra === parseInt(obraId, 10)
          );
          setObra(filteredResult[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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
    };

    fetchDataAsync();
  }, [token, navigate, obraId]);

  const fetchAutos = async () => {
    try {
      const autosResult = await fetchData(`/transporte/${obraId}`, token);
      setAutos(autosResult);

      const initialStatus = autosResult.reduce((acc, auto) => {
        acc[auto.id_transporte] = {
          isMaintained: auto.necesita_mantenimiento,
          buttonColor: auto.necesita_mantenimiento ? "green" : "#3E4692",
          buttonText: auto.necesita_mantenimiento
            ? "Mantenimiento realizado"
            : "Solicitar Mantenimiento",
        };
        return acc;
      }, {});
      setMaintenanceStatus(initialStatus);
    } catch (error) {
      console.error("Error fetching autos:", error);
    }
  };

  const handleReloadAutos = () => {
    setIsLoading(true);
    fetchAutos().then(() => setIsLoading(false));
    setDescription("");
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
  };

  const handleMaintenanceRequest = async (id, auto) => {
    const currentStatus = maintenanceStatus[id]?.isMaintained || false;
    const newStatus = !currentStatus;
    const currentDescription = description || "";

    try {
      await putData(
        `/editar_transporte/${id}/`,
        {
          necesita_mantenimiento: newStatus,
          descripcion_mantenimiento: currentDescription,
        },
        token
      );
      const fechaCreacion = new Date().toISOString().split("T")[0];
      const obraData = await fetchData(`/obra/${obraId}`, token);

      const dataNotificacion = {
        titulo: newStatus
          ? "Mantenimiento Solicitado"
          : "Mantenimiento Realizado",
        descripcion: newStatus
          ? `Se pidió mantenimiento '${currentDescription}' al vehiculo ${auto.marca} ${auto.modelo} de la obra ${obraData[0].nombre}.`
          : `Se completó el mantenimiento del vehiculo ${auto.marca} ${auto.modelo} de la obra ${obraData[0].nombre}.`,
        id_usuario: user.id_usuario,
        id_obra: obraData[0].id_obra,
        fecha_creacion: fechaCreacion,
      };

      await crearNotificacion(
        dataNotificacion,
        token,
        "Obra",
        obraData[0].id_obra
      );
      await handleReloadAutos();

      setPopupTitle(
        newStatus ? "Mantenimiento Solicitado" : "Mantenimiento Realizado"
      );
      setPopupMessage(
        newStatus
          ? `Se solicitó mantenimiento '${currentDescription}' exitosamente.`
          : `Se completó el mantenimiento del vehiculo ${auto.marca} ${auto.modelo} exitosamente.`
      );
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      setPopupTitle("Error");
      setPopupMessage(
        "Ocurrió un error al actualizar el estado de mantenimiento. Por favor, inténtelo de nuevo."
      );
      setShowPopup(true);
    }
  };

  const handleCreateAuto = async () => {
    if (!formData.imagen) {
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
    }

    const data = new FormData();
    data.append("imagen", formData.imagen);
    data.append("marca", formData.marca);
    data.append("modelo", formData.modelo);
    data.append("patente", formData.patente);
    data.append(
      "kilometraje",
      formData.kilometraje === "" ? 0 : formData.kilometraje
    );

    try {
      const result = await postData(`/crear_transporte/`, data, token);
      if (!result || !result.id_transporte) {
        throw new Error("Invalid response from server");
      }
      await postData(
        `/crear_detalle_transporte/`,
        { id_obra: obraId, id_transporte: result.id_transporte },
        token
      ).then(async () => {
        const fechaCreacion = new Date().toISOString().split("T")[0];
        const obra = await fetchData(`/obra/${obraId}`, token);

        const dataNotificacion = {
          titulo: "Vehiculo Creado",
          descripcion: `Se creó el vehiculo ${formData.marca} ${formData.modelo} de la obra ${obra[0].nombre}.`,
          id_usuario: user.id_usuario,
          id_obra: obra[0].id_obra,
          fecha_creacion: fechaCreacion,
        };

        await crearNotificacion(
          dataNotificacion,
          token,
          "Obra",
          obra[0].id_obra
        );
        await handleReloadAutos();

        setPopupTitle("Vehiculo Creado");
        setPopupMessage(
          `Se creó el vehiculo ${formData.marca} ${formData.modelo} de la obra ${obra[0].nombre}.`
        );
        setAutoModal(null);
        setShowPopup(true);
      });
    } catch (error) {
      console.error("Error creating auto:", error);
      setPopupTitle("Error");
      setPopupMessage(
        "Ocurrió un error al crear el vehiculo. Por favor, inténtelo de nuevo."
      );
      setShowPopup(true);
    }
  };

  const handleUpdateAuto = async (id, auto) => {
    try {
      await putData(`/editar_transporte/${id}/`, formData, token);
      const fechaCreacion = new Date().toISOString().split("T")[0];
      const obra = await fetchData(`/obra/${obraId}`, token);

      const dataNotificacion = {
        titulo: "Vehiculo Actualizado",
        descripcion: `Se actualizó el vehiculo ${auto.marca} ${auto.modelo} de la obra ${obra[0].nombre}.`,
        id_usuario: user.id_usuario,
        id_obra: obra[0].id_obra,
        fecha_creacion: fechaCreacion,
      };

      await crearNotificacion(dataNotificacion, token, "Obra", obra[0].id_obra);
      await handleReloadAutos();

      setPopupTitle("Vehiculo Actualizado");
      setPopupMessage(
        `Se actualizó el vehiculo ${auto.marca} ${auto.modelo} de la obra ${obra[0].nombre} exitosamente.`
      );
      setShowPopup(true);

      return true;
    } catch (error) {
      console.error("Error updating auto:", error);
      setPopupTitle("Error");
      setPopupMessage(
        "Ocurrió un error al actualizar el vehiculo. Por favor, inténtelo de nuevo."
      );
      setShowPopup(true);
      return false;
    }
  };

  const handleDeleteAuto = async (auto) => {
    try {
      await deleteData(
        `/eliminar_detalle_transporte/${obraId}/${auto.id_transporte}/`,
        token
      );
      const fechaCreacion = new Date().toISOString().split("T")[0];
      const obra = await fetchData(`/obra/${obraId}`, token);

      const dataNotificacion = {
        titulo: "Vehiculo Eliminado",
        descripcion: `Se eliminó el vehiculo ${auto.marca} ${auto.modelo} de la obra ${obra[0].nombre}.`,
        id_usuario: user.id_usuario,
        id_obra: obra[0].id_obra,
        fecha_creacion: fechaCreacion,
      };

      setAutos((prevAutos) =>
        prevAutos.filter((a) => a.id_transporte !== auto.id_transporte)
      );
      await crearNotificacion(dataNotificacion, token, "Obra", obra[0].id_obra);
      await handleReloadAutos();

      setPopupTitle("Vehiculo Eliminado");
      setPopupMessage(
        `Se eliminó el vehiculo ${auto.marca} ${auto.modelo} de la obra ${obra[0].nombre} exitosamente.`
      );
      setShowPopup(true);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error ===
        "No se encontró un detalle de obra transporte con el ID proporcionado."
      ) {
        alert("No se encontró un auto con el ID proporcionado.");
      } else {
        console.error("Error deleting auto:", error);
        setPopupTitle("Error");
        setPopupMessage(
          "Ocurrió un error al eliminar el vehiculo. Por favor, inténtelo de nuevo."
        );
        setShowPopup(true);
      }
    }
  };

  const handleFileChange = (file) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imagen: file,
    }));
  };

  const filteredAutos = autos.filter((auto) => {
    return (
      auto.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auto.modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auto.patente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auto.kilometraje?.toString().includes(searchQuery) ||
      auto.anio?.toString().includes(searchQuery)
    );
  });

  const sortedAutos = [...filteredAutos].sort((a, b) => {
    if (a.necesita_mantenimiento === b.necesita_mantenimiento) {
      if (orderCriteria) {
        const aValue = a[orderCriteria];
        const bValue = b[orderCriteria];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return bValue - aValue;
        }
      }
      return 0;
    }
    return a.necesita_mantenimiento ? 1 : -1;
  });

  const filters = [
    { type: "marca", label: "Marca" },
    { type: "modelo", label: "Modelo" },
    { type: "patente", label: "Patente" },
    { type: "kilometraje", label: "Kilometraje" },
    { type: "anio", label: "Año" },
  ];

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditAutoClick = (auto) => {
    setFormData({
      marca: auto.marca,
      modelo: auto.modelo,
      patente: auto.patente,
      kilometraje: auto.kilometraje,
    });
    setAutoModal(auto.id_transporte);
  };

  return (
    <div>
      <FullNavbar selectedPage="Autos" />
      <div className="margen-arriba">
        <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
          <Breadcrumb.Item href="/vehiculos">Vehículos</Breadcrumb.Item>
          <Breadcrumb.Item active>{currentObra}</Breadcrumb.Item>
        </Breadcrumb>
        <SearchBar
          onSearchChange={handleSearchChange}
          onOrderChange={setOrderCriteria}
          filters={filters}
        />
        <div className="auto-list">
          {(!obra.id_tipousuario || obra.id_tipousuario === 2) && (
            <div className="auto-modal">
              <Modal
                title="Nuevo Vehículo"
                handleSave={handleCreateAuto}
                openButtonWidth="15"
                openButtonText="Añadir un vehiculo nuevo"
                content={
                  <>
                    <UploadImage
                      wide="13"
                      titulo="Imagen del Producto"
                      onFileChange={handleFileChange}
                      defaultImage={defaultImage}
                    />
                    <Form.Label
                      className="font-rubik"
                    >
                      Marca:
                    </Form.Label>
                    <Form.Control
                      name="marca"
                      type="text"
                      style={{ marginTop: "0.2rem", marginBottom: "0.7rem" }}
                      placeholder="Marca"
                      onChange={handleInputChange}
                    />
                    <Form.Label
                      className="font-rubik"
                    >
                      Modelo:
                    </Form.Label>
                    <Form.Control
                      name="modelo"
                      type="text"
                      style={{ marginTop: "0.2rem", marginBottom: "0.7rem" }}
                      placeholder="Modelo"
                      onChange={handleInputChange}
                    />
                    <Form.Label
                      className="font-rubik"
                    >
                      Patente:
                    </Form.Label>
                    <Form.Control
                      name="patente"
                      type="text"
                      style={{ marginTop: "0.2rem", marginBottom: "0.7rem" }}
                      placeholder="Patente"
                      onChange={handleInputChange}
                    />
                    <Form.Label
                      className="font-rubik"
                    >
                      Kilometros:
                    </Form.Label>
                    <Form.Control
                      name="kilometraje"
                      type="number"
                      style={{ marginTop: "0.2rem", marginBottom: "0.7rem" }}
                      placeholder="Kilometros"
                      onChange={handleInputChange}
                      min="0"
                      onBeforeInput={(event) => {
                        if (!/^[0-9]*$/.test(event.data)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </>
                }
              />
            </div>
          )}
          {Array.isArray(sortedAutos) && sortedAutos.length > 0 ? (
            sortedAutos.map((auto) => {
              const maintenance = maintenanceStatus[auto.id_transporte] || {};
              const cardStyle = maintenance.isMaintained
                ? { backgroundColor: "lightgray" }
                : {};
              const imageStyle = maintenance.isMaintained
                ? { filter: "grayscale(100%)" }
                : {};
              return (
                <GenericCard
                  key={auto.id_transporte}
                  foto={auto.imagen}
                  titulo={
                    <>
                      <strong>Marca:</strong> {auto.marca} -{" "}
                      <strong>Modelo:</strong> {auto.modelo}
                    </>
                  }
                  descrip1={
                    <>
                      <strong>Patente:</strong> {auto.patente}
                    </>
                  }
                  descrip2={
                    <>
                      <strong>Kilometraje:</strong> {auto.kilometraje} km
                    </>
                  }
                  descrip3={
                    auto.descripcion_mantenimiento !== "" && (
                      <>
                        <strong>Mantenimiento:</strong>{" "}
                        {auto.descripcion_mantenimiento}
                      </>
                    )
                  }
                  cardStyle={cardStyle}
                  imageStyle={imageStyle}
                  children={
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      <Row>
                        <Col xs={12} md={6} style={{ marginTop: "1rem" }}>
                          {!maintenance.isMaintained ? (
                            <Modal
                              buttonTextColor="black"
                              buttonColor="#D9D9D9"
                              title="Solicitar Mantenimiento"
                              openButtonWidth="15"
                              openButtonText="Solicitar Mantenimiento"
                              handleSave={() =>
                                handleMaintenanceRequest(
                                  auto.id_transporte,
                                  auto
                                )
                              }
                              content={
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  defaultValue={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  placeholder="Descripción del mantenimiento"
                                />
                              }
                            />
                          ) : (
                            <SendButton
                              wide="15"
                              text={
                                maintenance.buttonText ||
                                "Mantenimiento realizado"
                              }
                              backcolor={maintenance.buttonColor || "green"}
                              letercolor="white"
                              onClick={() =>
                                handleMaintenanceRequest(
                                  auto.id_transporte,
                                  auto
                                )
                              }
                            />
                          )}
                        </Col>
                        <Col xs={12} md={6} style={{ marginTop: "1rem" }}>
                          {(!obra.id_tipousuario ||
                            obra.id_tipousuario === 2) && (
                              <Modal
                                openButtonWidth="15"
                                openButtonText="Actualizar Vehículo"
                                title="Actualizar Vehículo"
                                handleShowModal={() => handleEditAutoClick(auto)}
                                handleSave={async () => {
                                  await handleUpdateAuto(autoModal, auto);
                                }}
                                showDeleteButton={true}
                                deleteFunction={() => handleDeleteAuto(auto)}
                                wide="100rem"
                                content={
                                  <>
                                    <Form.Label
                                      className="font-rubik"
                                    >
                                      Marca:
                                    </Form.Label>
                                    <Form.Control
                                      name="marca"
                                      type="text"
                                      style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
                                      defaultValue={auto.marca}
                                      onChange={handleInputChange}
                                    />
                                    <Form.Label
                                      className="font-rubik"
                                    >
                                      Modelo:
                                    </Form.Label>
                                    <Form.Control
                                      name="modelo"
                                      type="text"
                                      style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
                                      defaultValue={auto.modelo}
                                      onChange={handleInputChange}
                                    />
                                    <Form.Label
                                      className="font-rubik"
                                    >
                                      Patente:
                                    </Form.Label>
                                    <Form.Control
                                      name="patente"
                                      type="text"
                                      style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
                                      defaultValue={auto.patente}
                                      onChange={handleInputChange}
                                    />
                                    <Form.Label
                                      className="font-rubik"
                                    >
                                      Kilometros:
                                    </Form.Label>
                                    <Form.Control
                                      name="kilometraje"
                                      type="number"
                                      style={{ marginTop: "0.5rem" }}
                                      placeholder="Kilometros"
                                      onChange={handleInputChange}
                                      defaultValue={auto.kilometraje}
                                      min="0"
                                      onBeforeInput={(event) => {
                                        if (!/^[0-9]*$/.test(event.data)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />
                                  </>
                                }
                              />
                            )}
                        </Col>
                      </Row>
                    </div>
                  }
                />
              );
            })
          ) : (
            <p style={{ marginLeft: "7rem", marginTop: "1rem" }}>
              No hay vehiculos disponibles.
            </p>
          )}
        </div>
      </div>
      <Popup
        show={showPopup}
        setShow={setShowPopup}
        message={popupMessage}
        title={popupTitle}
      />

      <ConfirmationModal
        Open={deleteAutoModal}
        BodyText="¿Está seguro que desea eliminar este Vehiculo?"
        onClickConfirm={() => {handleDeleteAuto(deleteAutoModal); setDeleteAutoModal(null);}}
        onClose={() => setDeleteAutoModal(null)}
      />
    </div>
  );
}

export default AutosComponent;
