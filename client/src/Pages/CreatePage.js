import React, { useContext, useState } from 'react'
import { useHttp } from "../hooks/http.hook"
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Input } from '../components/Input'
export const CreatePage = () => {

    const { token } = useContext(AuthContext)
    const history = useHistory()
    const { request, error, clearError } = useHttp()
    const [inputValue, setInputValue] = useState(true)

    const [character, setCharacter] = useState({
        name: '',
        surename: '',
        male: "male",
        dateofbirth: null,
        phone: null,
        date: Date.now(),
        sale: null,
        position: null
    })

    useEffect(() => {
        if (error) {
            window.M.toast({ html: error })
        }
        clearError()
    }, [error, clearError])

    const pressHandler = async (event) => {
        if (event.key === 'Enter' || event.target.name === 'submitButton') {
            try {

                let isnum = /^\d+$/.test(character.sale);
                if (!isnum) {
                    window.M.toast({ html: `Оклад должен состоять только из цифр` })
                    return
                }
                await request('/api/workers/generate', 'POST', {
                    character
                }, { authorization: `Token ${token}` })

                history.push('/main')
            } catch (e) {
            }
        }
    }

    const changeHandler = (event) => {
        setCharacter({ ...character, [event.target.name]: event.target.value })
    }

    const checkHandler = (event) => {
        setCharacter({ ...character, male: event.target.name })
        setInputValue(!inputValue)
    }

    return (
        <div className='row ' >
            <div className="col s8 offset-s2" style={{ paddingTop: "2rem" }}>
                <div style={{ display: 'flex ', justifyContent: 'space-around' }} >

                    <p>
                        <label className='blue-text'>
                            <input type="checkbox"
                                name="male"
                                checked={inputValue}
                                onChange={(event) => checkHandler(event)} />
                            <span >Male</span>
                        </label>
                    </p>
                    <p><strong>Пол</strong></p>
                    <p>
                        <label className='red-text '>
                            <input type="checkbox"
                                name="female"
                                checked={!inputValue}
                                onChange={(event) => checkHandler(event)} />
                            <span>Female</span>
                        </label>
                    </p>
                </div>
                {Object.keys(character).map((item, index) => (item === 'male' || item === 'date' ? null : <Input
                    key={index}
                    name={item}
                    onChange={changeHandler}
                    onPress={pressHandler} />))}
                <button className='btn btn-large' name='submitButton' onClick={pressHandler}>Создать</button>
            </div>
        </div>
    )
}