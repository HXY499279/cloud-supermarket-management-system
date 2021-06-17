import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {
    UserOutlined,
    AppstoreOutlined,
    AlignLeftOutlined,
    PieChartOutlined,
    FileTextOutlined,
    AccountBookOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';

export default class MeNu extends Component {

    state = {
        current: 1
    }

    menuClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    render() {
        return (
            <Menu
                id="menu"
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[`1`]}
                onClick={this.menuClick}
            >
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    <Link to="/home/dashboard">
                        数据概况
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined />}>
                    <Link to="/home/uim" >
                        用户信息管理
                    </Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<AppstoreOutlined />}>
                    <Link to="/home/cim" >
                        商品信息管理
                    </Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<AlignLeftOutlined />} >
                    <Link to="/home/category" >
                        商品分类管理
                    </Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<FileTextOutlined />}>
                        <Link to="/home/om" >
                            订单信息管理
                        </Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<AccountBookOutlined />}>
                    <Link to="/home/adm" >
                        广告投放管理
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }
}
