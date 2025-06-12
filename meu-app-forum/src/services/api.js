import axios from axios
//npm i axios

const API_BASE_URL = 'http://localhost:3000/api' // trocar para o ip quando testar no celular

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api