import React from 'react'
import { MainPage } from './Pages/MainPage'
import { CreatePage } from './Pages/CreatePage'
import { EditPage } from './Pages/EditPage'
import { AuthPage } from './Pages/AuthPage'
import { Switch, Route, Redirect } from 'react-router-dom'

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/main" exact component={MainPage} />
                <Route path="/create" component={CreatePage} />
                <Route path="/edit/:id" component={EditPage} />
                <Redirect to="/main" />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/auth" exact component={AuthPage} />
            <Redirect to="/auth" />
        </Switch>
    )

}