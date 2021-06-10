import React, { Component, } from 'react'
import { Descriptions, Divider, Breadcrumb, Table, Button, message, Popconfirm } from 'antd';
import reqwest from 'reqwest';
import axios from 'axios';
import { BrowserRouter, Link, Route, Switch, } from 'react-router-dom'
import 'antd/dist/antd.css'
import './index.css'
import UimChangePassword from '../../../utils/UimChangePassword/UimChangePassword'


const getRandomuserParams = params => ({
    current: params.pagination.current,
    pageSize: params.pagination.pageSize,
});

export default class Uim extends Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 5
        },
        loading: false,
        status: 0
    };

    confirm(id) {
        let { current, pageSize } = this.state.pagination
        const data = { id: id, current, pageSize }
        reqwest({
            // 后端接口
            url: '/deleteuser',
            method: 'post',
            type: 'json',
            // 传递给后端的数据
            data: data,
        })
            //根据返回的状态码status判断是否删除用户成功
            .then(res => {
                console.log(res)
                this.setState({
                    data: res.results
                })
                if (res.status === 'success') {
                    message.success('删除成功');
                } else {
                    message.error('删除失败');
                }
            })
    }

    columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account'
        },
        {
            title: '密码',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return (
                    <>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5 }}
                        >
                            <Link to={`/home/uim/changepassword/${id}`}>
                                更改密码
                            </Link>
                        </Button>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5, marginLeft: 20 }}
                            danger
                        >
                            <Popconfirm
                                title="确定删除该用户吗?"
                                onConfirm={this.confirm.bind(this, id)}
                                okText="确认"
                                cancelText="取消"
                            >
                                删除用户
                            </Popconfirm>
                        </Button>
                    </>
                )
            }
        },
    ];

    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });
    }

    handleTableChange = (pagination) => {
        console.log(pagination)
        let { current, pageSize } = pagination
        // console.log(pagination)
        this.setState({
            pagination: {
                current,
                pageSize
            }
        })
        this.fetch({
            pagination,
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            // 后端接口
            url: '/userlist',
            method: 'post',
            type: 'json',
            // 传递给后端的数据
            data: getRandomuserParams(params),
        })
            .then(data => {
                this.setState({
                    loading: false,
                    // 根据接口返回的数据源
                    data: data.results,
                    pagination: {
                        ...params.pagination,
                        // 根据接口返回的总条数
                        total: data.total,
                    },
                });
            })
            ;
    };

    UimChangePasswordComponent = (props) => {
        let id = props.match.params.id * 1
        let dataitem = this.state.data.filter(item => {
            if (item.id === id) {
                return item
            }
        })
        return <UimChangePassword data={dataitem} />
    }

    render() {
        const { data, pagination, loading } = this.state;
        function TableComponent() {
            return <Table
                columns={this.columns}
                rowKey={record => record.login}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
            />
        }
        return (
            <div>
                <Divider style={{ margin: 0 }} />
                <div className="descwraper">
                    <Breadcrumb className="bdc">
                        <Breadcrumb.Item>
                            <a href="/home">主页</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>用户信息管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <Descriptions title="用户列表" className="desc">
                        <Descriptions.Item>用户信息展示，可进行用户密码修改和删除用户操作</Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="contentWraper">
                    <BrowserRouter>
                        <Switch>
                            <Route path='/home/uim/changepassword/:id?' component={this.UimChangePasswordComponent} />
                            <Route path='/home/uim' component={TableComponent.bind(this)} />
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}
