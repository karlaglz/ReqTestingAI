document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-input");
  const fileNameSpan = document.getElementById("file-name");
  const progressBar = document.getElementById("progress-bar");
  const uploadStatus = document.getElementById("upload-status");
  const fileContentArea = document.getElementById("requirements-input");
  const submitFileButton = document.getElementById("submitFile");

  fileInput.addEventListener("change", updateFileName);

  function updateFileName() {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileNameSpan.textContent = file.name;

      const reader = new FileReader();
      reader.onprogress = function (event) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          progressBar.style.width = percentComplete + "%";
          uploadStatus.textContent =
            "Uploading: " + Math.round(percentComplete) + "%";
        }
      };

      reader.onload = function () {
        fileContentArea.value = reader.result;
        progressBar.style.width = "100%";
        uploadStatus.textContent = "Upload complete";
      };

      reader.onerror = function () {
        uploadStatus.textContent = "Error uploading file";
      };

      reader.readAsText(file);
    } else {
      fileNameSpan.textContent = "No file selected";
      progressBar.style.width = "0%";
      uploadStatus.textContent = "";
      fileContentArea.value = "";
    }
  }

  submitFileButton.addEventListener("click", function () {
    // Get the content of the file
    const requirements = fileContentArea.value;
    analyzeWebPage(requirements);
  });
});
