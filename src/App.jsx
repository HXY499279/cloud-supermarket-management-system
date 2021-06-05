import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home'
import Test from './pages/Test/Test'

export default class App extends Component {
    render() {
        return (
            <div>
                <BrowserRouter >
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Home} />
                        <Route path="/test" component={Test} />
                        <Redirect path="/" to="/login" />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
