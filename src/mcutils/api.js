import api from "mcutils/api/api.js";
import { setUser } from "../charte/utils.js";

api.on(['login', 'logout'], setUser);

export default api;