import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
class notify {
  toast (message) {
    toast(message);
  }

  success (message, options = { position: toast.POSITION.TOP_CENTER, autoClose: 1500 }) {
    toast.success(message, options);
  }

  error (message, options = { position: toast.POSITION.TOP_CENTER }) {
    toast.error(message, options);
  }

  warn (message, options = { position: toast.POSITION.TOP_CENTER }) {
    toast.warn(message, options);
  }

  info (message, options = { position: toast.POSITION.TOP_CENTER }) {
    toast.info(message, options);
  }
  clear () {
    toast.clearAll()
  }
}

export default new notify()