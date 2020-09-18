import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useHttp } from '../hooks/http.hook'
// import {useParams} from 'react-router-dom'
import { Input } from '../components/Input'

export const EditPage = () => {
   const history = useHistory()
   const id = useSelector(state => { return state.id })//id текущего работника
   const [newEmployee, setNewEmployee] = useState({})//измененный работник
   const { request, error} = useHttp()
   // const linkId = useParams().id
   useEffect(() => {
      async function getWorker() {
         try {

            const fetched = await request(`/api/workers/edit/${id}`, 'GET', null)
            setNewEmployee(fetched)
         } catch (e) {
            console.log(e)
         }
      }
      getWorker()
   }, [id, request])

   useEffect(() => {
      if (error) {
         window.M.toast({ html: error })
      }

   }, [error])

   const submitHandler = async () => {

      let result = Object.values(newEmployee).filter(item => item === '')

      if (result.length) {
         console.log(result)
         window.M.toast({ html: 'Заполните все поля' })
         result = []
         return
      }

      let isnum = /^\d+$/.test(newEmployee.sale);

      if (!isnum) {
         window.M.toast({ html: `Оклад должен состоять только из цифр` })
         return
      }

      await request(`/api/workers/edit/${id}`, "POST", newEmployee)
      history.push('/main')

   }

   const changeHandler = (event) => {
      setNewEmployee({ ...newEmployee, [event.target.name]: event.target.value })
   }

   const arr = ['male', 'date', '_id', 'person', 'dateofbirth', '__v']


   const returnBack = () => {
      if (error) history.push('/main')
   }
   return (<div>
      <h1>Изменение данных работника </h1>

      {Object.keys(newEmployee).map((item, index) => (arr.includes(item) ? null : <Input
         key={index}
         name={item}
         value={newEmployee[item]}
         onChange={changeHandler}
      />))}

      <button
         type='submit'
         className='btn btn green'
         onClick={submitHandler}>Редактировать</button>
      {error  &&  returnBack()  }
      
   </div>
   )
}