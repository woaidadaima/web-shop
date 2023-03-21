//配置存储token的函数
export const setToken = (token) => {
    localStorage.setItem('token',token)
}
//配置读取token的函数
export const getToken = () => {
    return localStorage.getItem('token')
}
//配置清楚token的函数
export const removeToken = () => {
    localStorage.removeItem('token')
}