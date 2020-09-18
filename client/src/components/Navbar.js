import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
export const Navbar = () => {

    const context = useContext(AuthContext)
    const history = useHistory()
    const logoutHandler = (event) => {
        event.preventDefault()
        context.logout()
        history.push('/')
    }

    return (
        <nav>
            <div className="nav-wrapper " style={{ padding: '0 2rem', background: 'linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)' }}>
                <span href="#" className="brand-logo center">Контроль работников</span>
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li ><NavLink to='/create' >Создать</NavLink></li>
                    <li><NavLink to='/main'>Главная</NavLink></li>
                    <li><a href='/' onClick={logoutHandler}> Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}