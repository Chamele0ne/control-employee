import { useState, useCallback, useEffect } from 'react'

export const useAuth = () => {

    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(false)

    const login = useCallback((jwtToken, id) => {

        setToken(jwtToken)//указываем токен с Back
        setUserId(id)//указываем id с Back

        localStorage.setItem('userData', JSON.stringify({ userId: id, token: jwtToken }))

    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem('userData')
    }, [])

    useEffect(() => {

        const data = JSON.parse(localStorage.getItem('userData'))

        if (data && data.token) {
            login(data.token, data.userId)
        }

        setLoading(true)
    }, [login])

    return { login, logout, token, userId, loading }
}