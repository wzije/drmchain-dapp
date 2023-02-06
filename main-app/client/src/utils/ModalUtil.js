import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const Alert = (message) => {
  MySwal.fire({
    title: <strong>Caution!</strong>,
    html: <i>{message}</i>,
    icon: "warning",
  });
  return;
};

export const Error = (message, callback) => {
  const swall = MySwal.fire({
    title: <strong>Error</strong>,
    html: <i>{message}</i>,
    icon: "error",
  });
  return swall;
};

export const Success = (message, callback) => {
  const swall = MySwal.fire({
    title: <strong>Success</strong>,
    html: <i>{message}</i>,
    icon: "success",
  });
  return swall;
};

export const Info = (message) => {
  MySwal.fire({
    title: <strong>Info!</strong>,
    html: <i>{message}</i>,
    icon: "info",
  });
  return;
};

export default MySwal;
