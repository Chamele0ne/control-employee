import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'

export const AuthPage = () => {

    const context = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()

    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        if (error) {
            window.M.toast({ html: error })
        }
        clearError()
    }, [error, clearError])

    const changeHandler = event => {
        setForm({
            ...form, [event.target.name]: event.target.value
        })
    }

    const registerHandler = async () => {
        try {
            await request('/api/auth/register', 'POST', { ...form })

        } catch (e) {
            console.log(e)
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { ...form })//обратно получаем res.json()
            context.login(data.token, data.userId)
        } catch (e) {
            console.log(e)
        }
    }




    return (
        <div className='row' >
            <div className="col s6 offset-s3">
                <h1>Контроль сотрудников</h1>
                <div className="card blue darken-1" style={{ borderRadius: '30px' }}>

                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                    </div>
                    <div className='row' style={{ margin: '10px' }}>

                        <div className="input-field col s12">
                            <input
                                placeholder='Введите email'
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                className="light-input"
                                onChange={changeHandler} />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field col s12" >
                            <input
                                placeholder='Введите password'
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                className="light-input"
                                onChange={changeHandler}
                            />
                            <label htmlFor="password">Password</label>
                        </div>

                    </div>
                    <div className="card-action" style={{ borderRadius: '30px' }}>
                        <button
                            className="btn green darken-3"
                            style={{ marginRight: '10px' }}
                            disabled={loading}
                            onClick={loginHandler}
                        >Войти</button>
                        <button
                            className="btn grey lighten-1 black-text"
                            disabled={loading}
                            onClick={registerHandler}>Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
