import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd'

const routes = [
    {
        path: 'home',
        breadcrumbName: 'home',
    },
    {
        path: 'first',
        breadcrumbName: 'first',
    },
    {
        path: 'second',
        breadcrumbName: 'second',
    },
];

function itemRender(route, params, routes, paths) {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
        <span>{route.breadcrumbName}</span>
    ) : (
        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
    );
}

export default class Test extends Component {
    render() {
        return (
            <div>
                <Breadcrumb itemRender={itemRender} routes={routes} />
            </div>
        )
    }
}

