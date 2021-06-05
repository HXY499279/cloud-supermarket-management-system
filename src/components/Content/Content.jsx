import React, { Component } from 'react'
import Uim from './Uim/Uim'
import Adm from './Adm/Adm'
import Cim from './Cim/Cim'
import Dashboard from './Dashboard/Dashboard'
import Od from './Od/Od'
import Oq from './Oq/Oq'
import Rp from './Rp/Rp'
import Tpc from './Tpc/Tpc'
import Tsc from './Tsc/Tsc'

export default class Content extends Component {
    render() {
        let name = this.props.match.params.name
        switch (name) {
            case 'tsc':
                return <Tsc />
            case 'adm':
                return <Adm />
            case 'cim':
                return <Cim />
            case 'uim':
                return <Uim />
            case 'od':
                return <Od />
            case 'oq':
                return <Oq />
            case 'rp':
                return <Rp />
            case 'tpc':
                return <Tpc />
            default:
                return <Dashboard />
        }
    }
}
