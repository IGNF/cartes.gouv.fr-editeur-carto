import api from "mcutils/api/api";
import { setUser } from "../charte/utils";

api.on(['login', 'logout'], setUser)

export default api;