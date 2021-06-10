import React, { Component } from 'react'
import Uim from './Uim/Uim'
import Adm from './Adm/Adm'
import Cim from './Cim/Cim'
import Dashboard from './Dashboard/Dashboard'
import Om from './Om/Om'
import Category from './Category/Category'

export default class Content extends Component {
    render() {
        let name = this.props.match.params.name
        switch (name) {
            case 'category':
                return <Category />
            case 'adm':
                return <Adm />
            case 'cim':
                return <Cim />
            case 'uim':
                return <Uim />
            case 'om':
                return <Om />
            default:
                return <Dashboard />
        }
    }
}
