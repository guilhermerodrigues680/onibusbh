import Swal from "sweetalert2";

const SwalToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  // timerProgressBar: true,
  didOpen: toast => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});

//
// Toasts
//

function fireToastSuccess(title, textHtml) {
  return SwalToast.fire({
    title,
    html: textHtml,
    icon: "success"
  });
}

function fireToastInfo(title, textHtml) {
  return SwalToast.fire({
    title,
    html: textHtml,
    icon: "info"
  });
}

function fireToastWarning(title, textHtml) {
  return SwalToast.fire({
    title,
    html: textHtml,
    icon: "warning"
  });
}

function fireToastError(title, textHtml) {
  return SwalToast.fire({
    title,
    html: textHtml,
    icon: "error"
  });
}

//
// Alerts
//

function fire(textHtml) {
  return Swal.fire({
    html: textHtml
  });
}

function fireSuccess(title, textHtml) {
  return Swal.fire({
    title,
    html: textHtml,
    icon: "success"
  });
}

function fireInfo(title, textHtml) {
  return Swal.fire({
    title,
    html: textHtml,
    icon: "info"
  });
}

function fireWarning(title, textHtml) {
  return Swal.fire({
    title,
    html: textHtml,
    icon: "warning"
  });
}

function fireError(title, textHtml) {
  return Swal.fire({
    title,
    html: textHtml,
    icon: "error"
  });
}

function fireConfirmDelete(title, confirmButtonText = "Deletar") {
  return Swal.fire({
    title,
    confirmButtonText,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    icon: "warning",
    confirmButtonColor: "#F44336"
  });
}

function fireConfirmAction(title, confirmButtonText) {
  return Swal.fire({
    title,
    confirmButtonText,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    icon: "question"
    // confirmButtonColor: "#F44336"
  });
}

export default {
  fireToastSuccess,
  fireToastInfo,
  fireToastWarning,
  fireToastError,
  fire,
  fireSuccess,
  fireInfo,
  fireWarning,
  fireError,
  fireConfirmDelete,
  fireConfirmAction
};
