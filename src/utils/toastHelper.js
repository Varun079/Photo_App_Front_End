import { toast } from "react-toastify";

export const ErrorToast = (text, props) => {
    toast.error(text, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...props,
    });
};

export const WarnToast = (text, props) => {
    toast.warn(text, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        ...props,
    });
};

export const InfoToast = (text, props) => {
    toast.info(text, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...props,
    });
};

export const DefaultToast = (text, props) => {
    toast(text, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...props,
    });
};

export const SuccessToast = (text, props) => {
    toast.success(text, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...props,
    });
};

export const ToastModal = (Component, componentDataObj) => {
    toast.info(Component, {
        ...componentDataObj,
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        position: "bottom-center",
    });
};
