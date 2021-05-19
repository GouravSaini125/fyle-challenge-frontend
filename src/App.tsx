import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Branches from "./pages/Branches";
import BranchDetail from "./pages/BranchDetail";
import './App.css';

function App() {

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Branches}/>
                <Route exact path="/:branchID" component={BranchDetail}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App;
