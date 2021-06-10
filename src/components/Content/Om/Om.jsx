import React, { Component } from 'react'
import { Descriptions, Divider, Breadcrumb, Button, Input, message, InputNumber, DatePicker, Table, ConfigProvider, Popconfirm, Row, Col, Space, Affix } from 'antd';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { nanoid } from 'nanoid'
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';
import { SearchOutlined } from '@ant-design/icons'
import './index.css'
// 配置中文环境
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;

export default class Om extends Component {

    state = {
        date: [],
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false,
        status: 'willdelivery'
    };

    comfirmStatus = () => {
        switch (this.state.status) {
            case "willdelivery":
                return "willdelivery"
            case "delivery":
                return "delivery"
            case "success":
                return "success"
            case "refund":
                return "refund"
            case "refunded":
                return "refunded"
            default:
                return "sendgoods"
        }
    }

    comfirmStatusLanguage = (arr) => {
        arr.forEach(item => {
            console.log(item.status)
            switch (item.status) {
                case "willdelivery":
                    item.status =  "待发货"
                    break;
                case "delivery":
                    item.status =  "配送中"
                    break;
                case "success":
                    item.status =  "已成功"
                    break;
                case "refund":
                    item.status =  "退款中"
                    break;
                case "refunded":
                    item.status =  "已退款"
                    break;
            }
        })

    }

    columns = [
        {
            title: '订单id',
            dataIndex: 'ofid',
            key: 'ofid',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: '用户id',
            dataIndex: 'uid',
            key: 'uid'
        },
        {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'status',
            className: this.comfirmStatus()
        },
        {
            title: '下单时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: '操作',
            dataIndex: 'ofid',
            key: 'ofid',
            render: (ofid) => {
                return (
                    <>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5, marginLeft: 20 }}
                        >
                            <Popconfirm
                                title="确定吗?"
                                onConfirm={this.confirm.bind(this, ofid)}
                                okText="确认"
                                cancelText="取消"
                            >
                                发货
                            </Popconfirm>
                        </Button>
                    </>
                )
            }
        },
    ];



    confirm = (id) => {
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

    dateOnChange = (value, dateString) => {
        let startDate = dateString[0].replace(/\//g, "-")
        let endDate = dateString[1].replace(/\//g, "-")
        let date = [startDate, endDate]
        this.setState({
            date: date
        })
    }

    OmSearch = () => {
        console.log(this.comfirmStatus())
        console.log(this.state.date)
        let [oid, ofName, date] = [
            this.idInput.value,
            this.nameInput.state.value,
            this.state.date
        ]
        const data = { oid, ofName, date }
        console.log(data)
        reqwest({
            url: 'searchorderform',
            method: 'post',
            type: 'json',
            data: data
        })
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

    getRandomuserParams = params => ({
        current: params.pagination.current,
        pageSize: params.pagination.pageSize,
        status: this.state.status
    });

    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            // 后端接口
            url: '/om/oflist',
            method: 'post',
            type: 'json',
            // 传递给后端的数据
            data: this.getRandomuserParams(params),
        })
            .then(data => {
                // 数据处理-给每条数据添加独立的key
                data.results.forEach(item => {
                    item.key = nanoid()
                })
                // 数据处理-将status从英文变成中文在页面显示
                this.comfirmStatusLanguage(data.results)
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


    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });
    }

    render() {
        const { data, pagination, loading } = this.state;
        return (
            <div>
                <Divider style={{ margin: 0 }} />
                <div className="Om-head">
                    <div className="Om-desc-wraper">
                        <Breadcrumb className="bdc">
                            <Breadcrumb.Item>
                                <a href="/home">主页</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>订单信息管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <Descriptions title="订单管理" className="desc">
                            <Descriptions.Item>展示订单信息，查询订单，查看订单状态，处理订单的发货，确认送达和退款</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="status-switch">
                        <Space>
                            <Button className="status-button ">待发货</Button>
                            <Button className="status-button ">配送中</Button>
                            <Button className="status-button ">已成功</Button>
                            <Button className="status-button ">退款中</Button>
                            <Button className="status-button ">已退款</Button>
                        </Space>
                    </div>
                </div>
                <div className="search">
                    <Divider style={{ margin: 0 }} />
                    <Space style={{ marginTop: 20 }} size={20}>
                        <div>
                            订单id:
                                <InputNumber name='Oid' className="Om-input" ref={elev => { this.idInput = elev }} />
                        </div>
                        <div>
                            用户名称:
                                <Input name="commodity" className="Om-input" ref={elev => { this.nameInput = elev }} />
                        </div>
                        <div>
                            时间:
                                <ConfigProvider locale={zh_CN}>
                                <RangePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    onChange={this.dateOnChange}
                                    ref={elev => { this.dateElev = elev }}
                                />
                            </ConfigProvider>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={this.OmSearch} />
                        </div>
                    </Space>
                </div>
                <div className="tableWraper contentWraper">
                    <Table
                        columns={this.columns}
                        dataSource={data}
                        pagination={pagination}
                        loading={loading}
                        onChange={this.handleTableChange}
                        bordered={true}
                        expandable={{
                            expandedRowRender: record => {
                                return <div className="sub-order">
                                    <p>用户收货地址: {record.address} {record.uname} {record.phone} </p>
                                    <p style={{ fontWeight: 600, fontSize: 14 }}>商品详情:</p>
                                    {record.commodityDetails.map(item => {
                                        return <div className="commodity-details" >
                                            <div className="commodity-details-item" >编号: {item.cid}</div>
                                            <div className="commodity-details-item" >名称: {item.commodityName}</div>
                                            <div className="commodity-details-item" >数量: {item.count}</div>
                                        </div>
                                    })}
                                </div>
                            },
                        }}
                    />
                </div>
            </div>

        )
    }
}
