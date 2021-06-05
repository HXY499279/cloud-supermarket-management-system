import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Link } from 'react-router-dom';
import { Layout, Menu, Affix, Breadcrumb } from 'antd';
import './index.css';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
//导入组件
import Conten from '../../components/Content/Content'
import MeNu from '../../components/Menu/MeNu'
// import Uim from '../../components/Uim/Uim'
// import Adm from '../../components/Content/Adm/Adm'
// import Cim from '../../components/Cim/Cim'
// import Dashboard from '../../components/Dashboard/Dashboard'
// import Od from '../../components/Od/Od'
// import Oq from '../../components/Oq/Oq'
// import Rp from '../../components/Rp/Rp'
// import Tpc from '../../components/Tpc/Tpc'
// import Tsc from '../../components/Tsc/Tsc'


const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default class Home extends Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    logoClick = () => {
        window.location.href = 'http://localhost:3000/home'
    }

    render() {
        let adminObj = JSON.parse(sessionStorage.getItem("admin"))
        return (adminObj === null) ? <Redirect path='/login' /> :
            (
                <BrowserRouter>
                    <Layout>
                        <Affix >
                            <Sider id='sider' trigger={null} collapsible collapsed={this.state.collapsed} style={{ minHeight: '100vh' }}>
                                <div className="logo" style={{ color: 'white', textAlign: 'center', padding: 19 }}>
                                    <div onClick={this.logoClick} id="logo">
                                        重邮超市管理系统
                                    </div>
                                </div>
                                <MeNu />
                            </Sider>
                        </Affix>
                        <Layout className="site-layout">
                        <Header className="site-layout-background" style={{ paddingLeft: 16, height: 35 }}>
                            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: this.toggle,
                            })}
                        </Header>
                            {/* className="site-layout-background" */}
                            <div>
                                <Route path="/home/:name?" component={Conten} />
                                {/* <Route path="/home/dashBoard" component={Dashboard} />
                                    <Route path="/home/uim" component={Uim} />
                                    <Route path="/home/cim" component={Cim} />
                                    <Route path="/home/tpc" component={Tpc} />
                                    <Route path="/home/tsc" component={Tsc} />
                                    <Route path="/home/oq" component={Oq} />
                                    <Route path="/home/od" component={Od} />
                                    <Route path="/home/rp" component={Rp} />
                                    <Route path="/home/adm" component={Adm} /> */}
                            </div>
                        </Layout>
                    </Layout>
                </BrowserRouter>
            )
    }
}
