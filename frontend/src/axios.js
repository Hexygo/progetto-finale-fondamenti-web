import axios from "axios"

axios.defaults.withCredentials=true

const axiosInstance=axios.create({
    withCredentials:true
})

export default axiosInstance