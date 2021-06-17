import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { Layout, Affix } from 'antd';
import './index.css';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
//导入组件
import Conten from '../../components/Content/Content'
import MeNu from '../../components/Menu/MeNu'

const { Header, Sider } = Layout;

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

    showContent = () => {
        return <Layout className="site-layout">
            <Header className="site-layout-background" style={{ paddingLeft: 16, height: 35 }} >
                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: this.toggle,
                })}
            </Header>
            <div>
                <Route path="/home/:name?" component={Conten} />
            </div>
        </Layout>
    }

    showSider = () => {
        return <Affix >
            <Sider id='sider' trigger={null} collapsible collapsed={this.state.collapsed} style={{ minHeight: '100vh' }}>
                <div className="logo" style={{ color: 'white', textAlign: 'center', padding: 19 }}>
                    <div onClick={this.logoClick} id="logo">
                        重邮超市管理系统
                    </div>
                </div>
                <MeNu />
            </Sider>
        </Affix>
    }

    render() {
        let adminObj = JSON.parse(sessionStorage.getItem("admin"))
        return (adminObj === null) ? <Redirect path='/login' /> :
            (
                <BrowserRouter>
                    <Layout>    
                        {this.showSider()}
                        {this.showContent()}
                    </Layout>
                </BrowserRouter>
            )
    }
}
