import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { Descriptions, Divider, Breadcrumb, Button, message, Popconfirm, Table, Upload, Image } from 'antd';
import reqwest from 'reqwest';
import axios from 'axios'
import AdmAddAd from '../../../utils/AdmAddAd/AdmAddAd'
import 'antd/dist/antd.css'
import './index.css'


export default class Adm extends Component {
    state = {
        adData: [],
        adid: ''
    }

    property = {
        name: 'file',
        headers: {
            authorization: 'authorization-text'
        },
        showUploadList: false,
        customRequest: (data) => {
            console.log(this.state.adData)

            let formData = new FormData()
            formData.append("file", data.file);
            formData.append("adid", this.state.adid);
            axios({
                // 后端接口
                url: '/modifyad',
                method: 'post',
                // 传递给后端的数据
                data: formData,
            })
                .then(res => {
                    console.log(res)
                    let newData = res.data
                    if (newData.status === '图片修改成功') {
                        let adData = this.state.adData
                        adData.forEach(item => {
                            if (item.adid === this.state.adid) {
                                item.picture = newData.url
                            }
                        })
                        this.setState({
                            adData
                        })
                        message.success("广告图片更改成功！")
                    } else {
                        message.error("广告图片更改失败！")
                    }
                })
        },
        maxCount: 1
    };

    confirm(adid) {
        const data = { adid: adid }
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
                if (res.status === "success") {
                    this.setState({
                        adData: res.results
                    })
                    message.success('删除成功');
                } else {
                    message.error('删除失败');

                }
            })
    }

    getAdid = (adid) => {
        this.setState({
            adid
        })
    }

    columns = [
        {
            title: 'adid',
            dataIndex: 'adid',
            key: 'adid',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.adid - b.adid,
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
            render: picture => (
                <>
                    <Image
                        preview={false}
                        width={150}
                        src={picture}
                    />
                </>
            ),
        },
        {
            title: '操作',
            dataIndex: 'adid',
            key: 'operation',
            render: (adid) => {
                return (
                    <>
                        <Upload {...this.property}>
                            <Button
                                type="primary"
                                style={{ borderRadius: 5 }}
                                onClick={this.getAdid.bind(this, adid)}
                            >
                                修改图片
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5, marginLeft: 13 }}
                            danger
                        >
                            <Popconfirm
                                title="确定删除该广告吗?"
                                onConfirm={this.confirm.bind(this, adid)}
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
                console.log(res)
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
                            <Route path='/home/adm/addad' component={AdmAddAd.bind(this,this.state.adData.length)} />
                            <Route path='/home/adm' component={this.TableComponent} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
