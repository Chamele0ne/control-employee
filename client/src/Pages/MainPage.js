import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { currentId } from '../action'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Pagination } from '../components/Pagination'
import { Loader } from '../components/Loader'



export const MainPage = () => {
    const { token } = useContext(AuthContext)
    const dispatch = useDispatch()
    const history = useHistory()
    const { request, loading } = useHttp()
    const [workers, setWorkers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)
    const [value, setValue] = useState('')
    const [all, setAll] = useState([])

    const getWorkers = useCallback(async () => {
        let isMounted = true
        try {
            if (isMounted) {
                const fetched = await request('/api/workers', 'GET', null, { authorization: `Token ${token}` })//получение всех работников
                setWorkers(fetched)
                setAll(fetched)
            }

        } catch (e) {

        }
        return () => { isMounted = false; };
    }, [request, token])

    const editHandler = useCallback(async (id) => {
        try {

            dispatch(currentId(id))
            history.push(`/edit/:${id}`)
        } catch (e) {

        }
    }, [dispatch, history])

    const removeHandler = useCallback(async (id) => {

        await request(`/api/workers/remove/${id}`, 'POST', { id: id })//получение всех работников
        getWorkers()
    }, [request, getWorkers])


    useEffect(() => {
        getWorkers()
    }
        , [getWorkers])

    if (loading) {
        return (<Loader />)
    }

    if (!all.length) {
        return (<div style={{
            padding: '50px',
            textAlign: 'center',
            display: 'block'
        }}>
            <h1>Нет записей</h1>
            <button
                onClick={() => history.push('/create')}
                className='btn btn-large green'
            >Создать таблицу
        </button>
        </div>)
    }

    const submitHandler = (event) => {
        event.preventDefault()
        if (value !== '') {
            const sort = workers.filter(item => item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.surename.toLowerCase().includes(value.toLowerCase()))
            setWorkers(sort)
        }
        if (value === '') {
            getWorkers()
        }
        setValue('')
    }

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = workers.slice(indexOfFirstPost, indexOfLastPost)

    const paginate = (pageNumber, event) => {
        event.preventDefault()
        setCurrentPage(pageNumber)
    }
    return (
        <div >
            <div style={{ paddingTop: '2rem' }} >
                <div className="input-field col s6 offset-s2" style={{ marginLeft: '25%', marginRight: '25%' }}>
                    <form onSubmit={submitHandler}>
                        <div style={{ display: 'flex' }}>
                            <i className="material-icons" htmlFor="search">search</i>
                            <input id="search"
                                placeholder='Search'
                                type="text"
                                value={value}
                                onChange={(event) => { setValue(event.target.value) }}
                            />
                        </div>
                    </form>
                </div>
            </div>

            {!workers.length ?
                <div>
                    <h3>По вашему запросу нет результатов</h3>
                    <button className='btn btn-large' onClick={getWorkers}>Вернуться</button>
                </div>
                :
                <div >
                    <table className="highlight " >
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Дата Рождения</th>
                                <th>Дата Добавления</th>
                                <th>Должность</th>
                                <th>Оклад</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers && currentPosts.map((worker, index) => (<tr key={index}>
                                <td>{worker.name}</td>
                                <td>{worker.surename}</td>
                                <td>{worker.dateofbirth}</td>
                                <td>{worker.date}</td>
                                <td>{worker.position}</td>
                                <td>{worker.sale}</td>
                                <td>
                                    <button
                                        className='btn btn-small  waves-effect waves-light'
                                        style={{ marginRight: '2rem', backgroundColor: '#ff5252' }}
                                        onClick={(event) => removeHandler(worker._id)}
                                    >Удалить </button>
                                    <button
                                        className='btn btn-small  waves-effect waves-light '
                                        onClick={() => editHandler(worker._id)}
                                    >Редактировать </button>
                                </td>
                            </tr>))}


                        </tbody>
                    </table>
                </div>
            }
            <div >
                < Pagination totalPosts={workers.length} postsPerPage={postsPerPage} paginate={paginate} currentPage={currentPage} />
            </div>

        </div>
    )
}