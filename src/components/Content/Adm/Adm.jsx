import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { Descriptions, Divider, Breadcrumb, Button, message, Popconfirm, Table, Tag, Upload, Image } from 'antd';
import reqwest from 'reqwest';
import AdmAddAd from '../../../utils/AdmAddAd/AdmAddAd'
import 'antd/dist/antd.css'
import './index.css'



export default class Adm extends Component {
    state = {
        adData: []
    }

    confirm(id) {
        const data = { id: id }
        console.log(this.state.adData)
        reqwest({
            // 后端接口
            url: '/deletead',
            method: 'post',
            type: 'json',
            // 传递给后端的数据
            data: data,
        })
        //根据返回的状态码status判断是否删除广告成功
            .then(res => {
                console.log(res)
                this.setState({
                    adData: res
                },() => {
                    console.log(this.state.adData)
                })
                message.success('删除成功');
            }, () => {
                message.error('删除失败');
            })
    }

    props = {
        name: 'picture',
        action: 'http://localhost:3000/modifyad',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList:false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: '广告公司',
            dataIndex: 'adCompany',
            key: 'adCompany',
        },
        {
            title: '广告名称',
            dataIndex: 'adName',
            key: 'adName',
        },
        {
            title: '所属分类',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: '广告图片',
            key: 'picture',
            dataIndex: 'picture',
            render: src => (
                <>
                    <Image
                        preview={false}
                        width={150}
                        src={src}
                    />
                </>
            ),
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'operation',
            render: (id) => {
                return (
                    <>
                        <Upload {...this.props}>
                            <Button
                                type="primary"
                                style={{ borderRadius: 5 }}
                            >
                                修改图片
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5, marginTop: 10 }}
                            danger
                        >
                            <Popconfirm
                                title="确定删除该广告吗?"
                                onConfirm={this.confirm.bind(this, id)}
                                okText="确认"
                                cancelText="取消"
                            >
                                删除广告
                            </Popconfirm>
                        </Button>
                    </>
                )
            }
        },
    ];

    TableComponent = () => {
        return <Table columns={this.columns} dataSource={this.state.adData} pagination={false} />
    }

    componentDidMount() {
        reqwest({
            url: '/adlist',
            method: 'get',
            type: 'json',
        })
            .then(res => {
                this.setState({
                    adData: res
                })
            })
    }

    render() {
        console.log("我被渲染了")
        return (
            <div>
                <BrowserRouter>
                    <Divider style={{ margin: 0 }} />
                    <div className="descwraper">
                        <Breadcrumb className="bdc">
                            <Breadcrumb.Item>
                                <a href="/home">主页</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>广告投放管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <Descriptions title="广告管理" className="desc">
                            <Descriptions.Item>广告信息展示，可以进行新增广告，更改广告，删除广告操作。注意：最多只允许3个广告位</Descriptions.Item>
                        </Descriptions>
                        <Divider style={{ margin: 0 }} />
                        {(this.state.adData.length >= 3)
                            ?
                            <Button
                                type="primary"
                                style={{ marginBottom: 10, marginTop: 10, borderRadius: 5 }}
                                danger
                            >
                                广告位已达3位
                            </Button>
                            :
                            <Button
                                type="primary"
                                style={{ marginBottom: 10, marginTop: 10, borderRadius: 5 }}
                            >
                                <Link to='/home/adm/addad'>新增广告</Link>
                            </Button>
                        }
                    </div>
                    <div className="contentWraper">
                        <Switch>
                            <Route path='/home/adm/addad' component={AdmAddAd} />
                            <Route path='/home/adm' component={this.TableComponent} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
