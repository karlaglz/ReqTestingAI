window.addEventListener("load", function () {
  // Navegación
  const uploadFileButton = document.getElementById("uploadFile");
  const addRequirementsButton = document.getElementById("addRequirements");
  const backToMainButton = document.getElementById("backToMain");
  const analyzeButton = document.getElementById("analyzeWebPage");
  const loadingSpinner = document.getElementById("loading-spinner");
  const imageLinkContainer = document.getElementById("image-link-container");
  const imageLink = document.getElementById("image-link");
  const downloadReport = document.getElementById("downloadReport");

  let formattedComparison = "";
  let reportText = "";

  if (downloadReport) {
    downloadReport.style.display = "none";
    downloadReport.addEventListener("click", downloadReportAsTxt);
  }

  if (uploadFileButton) {
    uploadFileButton.addEventListener("click", () => {
      window.location.href = "upload.html";
    });
  }

  if (addRequirementsButton) {
    addRequirementsButton.addEventListener("click", () => {
      window.location.href = "requirements.html";
    });
  }

  if (backToMainButton) {
    backToMainButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (analyzeButton) {
    analyzeButton.addEventListener("click", async () => {
      // Mostrar el spinner de carga
      loadingSpinner.style.display = "block";
      // Ocultar el contenedor del enlace de la imagen
      imageLinkContainer.style.display = "none";

      // Capturar la pantalla y analizar la página web al hacer clic en el botón
      let imageURL = await captureAndUploadScreenshot();

      captureAndUploadScreenshot()
        .then((imageURL) => {
          console.log("Imagen subida exitosamente:", imageURL);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      await analyzeWebPage(imageURL);
    });
  }

  async function uploadImageToCloudinary(dataURI) {
    var blob = dataURItoBlob(dataURI);
    var formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "ml_default"); // Debes configurar un "upload preset" en Cloudinary

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dhdlemoeu/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al subir la imagen a Cloudinary");
    }

    const data = await response.json();
    return data.url;
  }

  // Función para capturar la pantalla completa y guardarla como PNG
  async function captureAndUploadScreenshot() {
    try {
      let dataURL = await chrome.tabs.captureVisibleTab(null, {
        format: "png",
      });

      // Subir la imagen capturada a Cloudinary
      let imageURL = await uploadImageToCloudinary(dataURL);
      console.log(imageURL);

      return imageURL;
    } catch (error) {
      console.error("Error durante la captura o subida:", error);
      throw error; // Opcional: re-lanzar el error para manejo posterior
    }
  }

  // Función para convertir un data URI en un Blob
  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  // Función para capturar la pantalla completa y guardarla como PNG
  // async function captureAndUploadScreenshot() {
  //   let dataURL = await chrome.tabs.captureVisibleTab(null, { format: "png" });
  //   const response = await fetch(
  //     `http://127.0.0.1:8000/screenshot/?uri=${dataURL}`
  //   );
  //   imageURL = await response.json();
  //   return imageURL["secure_url"];
  // }

  // Función para analizar la página web
  async function analyzeWebPage(imageURL) {
    const requirements = document.getElementById("requirements-input");
    const comparisonContainer = document.getElementById("comparison-container");
    const comparisonSpan = document.getElementById("comparison");

    const requirementsInput = requirements.value;
    let uiDescription = "";
    let comparison = "";

    let responseUI = await fetch(
      `http://127.0.0.1:8000/ui/?img_url=${imageURL}`
    );
    uiDescription = await responseUI.text();

    let responseComparison = await fetch(
      `http://127.0.0.1:8000/compare/?ui_description=${uiDescription}&design_requirements=${requirementsInput}`
    );
    let dataComparison = await responseComparison.json();
    comparison = dataComparison.message.content;
    formattedComparison = comparison.replace(/\r?\n|\r/g, "<br>");
    reportText = "Requirements given:\n" + requirementsInput;

    // Ocultar el spinner de carga
    loadingSpinner.style.display = "none";
    downloadReport.style.display = "block";
    comparisonContainer.style.display = "block";

    comparisonSpan.innerHTML = formattedComparison;
  }

  // Función para descargar el informe como archivo de texto
  function downloadReportAsTxt() {
    const textContent =
      reportText +
      "\n" +
      "\n" +
      "-------------------------------" +
      "\n" +
      "\n" +
      formattedComparison.replace(/<br>/g, "\n");
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
});
