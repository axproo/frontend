import toastr from "toastr";
import 'toastr/build/toastr.min.css'

toastr.options = {
    positionClass: 'toast-bottom-right',
    closeButton: true,
    progressBar: true,
    timeOut: 3000,
    extendedTimeOut: 2000
}

export const showSuccess = (message) => {
    toastr.success(message);
}

export const showError = (message) => {
    toastr.error(message);
}

export const showWarning = (message) => {
    toastr.warning(message);
}

export const showInfo = (message) => {
    toastr.info(message)
}