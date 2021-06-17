import React, { Component } from 'react'
import { Descriptions, Divider, Breadcrumb, Button, Input, message, InputNumber, DatePicker, Table, ConfigProvider, Popconfirm, Space, Empty } from 'antd';
import { nanoid } from 'nanoid'
import reqwest from 'reqwest';
import { SearchOutlined } from '@ant-design/icons'
import './index.css'
// 配置中文环境
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
// 引用工具
import ofStatusToChinese from '../../../utils/ofStatusToChinese';

const { RangePicker } = DatePicker;

export default class Om extends Component {

    state = {
        date: [],
        data: [],
        pagination: {
            current: 1,
            pageSize: 5,
            total: ''
        },
        loading: false,
        status: 'willdelivery',
        ofDetails: []
    };

    // 根据状态来切换订单信息中订单状态的className来切换其颜色
    confirmStatus = () => {
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

    getColumns = () => {
        let columns = [
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
                title: '订单状态',
                dataIndex: 'status',
                key: 'status',
                className: this.confirmStatus()
            },
            (this.state.status !== "success" && this.state.status !== "refunded")
                ?
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
                                        title={`确定${this.changeOprationButtonWord(this.state.status)}吗?`}
                                        onConfirm={this.confirmChangeStatus.bind(this, ofid)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        {this.changeOprationButtonWord(this.state.status)}
                                    </Popconfirm>
                                </Button>
                            </>
                        )
                    }
                }
                :
                {
                    className: "of-last-item-hidden"
                }
        ];
        return columns
    }

    // 更改操作按钮中的文字
    changeOprationButtonWord = (status) => {
        switch (status) {
            case "willdelivery":
                return "发货"
            case "delivery":
                return "完成订单"
            case "refund":
                return "退款"
            default:
                return "发货"
        }
    }

    // 确认更改订单状态操作
    confirmChangeStatus = (ofid) => {
        let { current, pageSize } = this.state.pagination
        const data = {
            ofid: ofid,
            current,
            pageSize,
            startStatus: this.state.status,
            endStatus: this.confirmEndStatus()
        }
        reqwest({
            // 后端接口
            url: '/om/changeofstatus',
            method: 'post',
            type: 'json',
            // 传递给后端的数据
            data: data
        })
            //根据返回的状态码status判断是否删除用户成功
            .then(res => {
                console.log(res)
                let data = res
                ofStatusToChinese(data.results)
                this.setState({
                    data: data.results
                })
                if (res.status === 'success') {
                    message.success('处理成功');
                } else {
                    message.error('处理失败');
                }
            })
    }
    // 根据startStatus来判断endStatus
    confirmEndStatus = () => {
        switch (this.state.status) {
            case "willdelivery":
                return "delivery"
            case "delivery":
                return "success"
            case "refund":
                return "refunded"
            default:
                return
        }
    }

    // 更改日期的提交格式
    dateOnChange = (value, dateString) => {
        let startDate = dateString[0].replace(/\//g, "-")
        let endDate = dateString[1].replace(/\//g, "-")
        let date = [startDate, endDate]
        this.setState({
            date: date
        })
    }

    // 搜索操作
    OmSearch = () => {
        console.log(this.state.date)
        let [ofid, uid, dateSta, dateEnd, status] = [
            this.ofidInput.value,
            this.uidInput.state.value,
            this.state.date[0],
            this.state.date[1],
            this.state.status
        ]
        dateSta = JSON.stringify(dateSta)
        dateEnd = JSON.stringify(dateEnd)
        const data = { ofid, uid, dateSta, dateEnd, status }
        console.log(data)
        reqwest({
            url: '/om/searchorderform',
            method: 'post',
            type: 'json',
            data: data
        })
            .then(data => {
                // 数据处理-给每条数据添加独立的key
                if (data.total !== 0) {
                    console.log(data)
                    data.results.forEach(item => {
                        item.key = nanoid()
                    })
                    ofStatusToChinese(data.results)
                    let pagination = this.state.pagination
                    pagination.total = data.total
                    this.setState({
                        data: data.results,
                        pagination
                    })
                    message.success("查询成功")
                } else {
                    message.error("查无订单")
                }

            })
    }

    // 点击Table按钮 渲染组件
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
                console.log(data)
                ofStatusToChinese(data.results)
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

    // 点击状态按钮切换渲染
    changeStatusAndPost = (status) => {
        const { pagination } = this.state;
        this.setState({
            status: status
        }, () => {
            this.fetch({ pagination });
        })

    }

    willdeliveryClick = () => {
        this.changeStatusAndPost("willdelivery")
    }
    deliveryClick = () => {
        this.changeStatusAndPost("delivery")
    }
    successClick = () => {
        this.changeStatusAndPost("success")
    }
    refundClick = () => {
        this.changeStatusAndPost("refund")
    }
    refundedClick = () => {
        this.changeStatusAndPost("refunded")
    }

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
                            <Descriptions.Item>展示订单信息，查询订单，查看订单状态，处理订单的发货，确认送达和同意退款</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="status-switch">
                        <Space>
                            <Button className="status-button" onClick={this.willdeliveryClick}>待发货</Button>
                            <Button className="status-button" onClick={this.deliveryClick}>配送中</Button>
                            <Button className="status-button" onClick={this.successClick}>已成交</Button>
                            <Button className="status-button" onClick={this.refundClick}>待退款</Button>
                            <Button className="status-button" onClick={this.refundedClick}>已退款</Button>
                        </Space>
                    </div>
                </div>
                <div className="search">
                    <Divider style={{ margin: 0 }} />
                    <Space style={{ marginTop: 20 }} size={20}>
                        <div>
                            订单id:
                            <InputNumber name='Oid' className="Om-input" ref={elev => { this.ofidInput = elev }} />
                        </div>
                        <div>
                            用户id:
                            <Input name="commodity" className="Om-input" ref={elev => { this.uidInput = elev }} />
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
                        columns={this.getColumns()}
                        dataSource={data}
                        pagination={pagination}
                        loading={loading}
                        onChange={this.handleTableChange}
                        bordered={true}
                        expandable={{
                            onExpand: (boo, item) => {
                                console.log(item, 222222222, this.state.ofDetails)
                                let tag = 1
                                this.state.ofDetails.forEach(detail => {
                                    console.log(detail.user.uid, item.uid)
                                    if (detail.commodityDetails[0].ofid === item.ofid) {
                                        tag = 0
                                    }
                                })
                                if (tag) {
                                    let data = {
                                        ofid: item.ofid,
                                        uid: item.uid
                                    }
                                    reqwest({
                                        url: '/om/ofdetails',
                                        method: "post",
                                        type: "json",
                                        data: data
                                    })
                                        .then(res => {
                                            console.log(res)
                                            res.commodityDetails.forEach(item => {
                                                item.key = nanoid()
                                            })
                                            let ofDetails = this.state.ofDetails
                                            ofDetails.push(res)
                                            this.setState({
                                                ofDetails: ofDetails
                                            })
                                        })
                                }
                            },
                            expandedRowRender: item => {
                                console.log(item.uid)
                                console.log(this.state.ofDetails)
                                let tag = 0
                                let index
                                this.state.ofDetails.forEach((detail, ind) => {
                                    console.log(detail.user.uid, item.uid)
                                    if (detail.commodityDetails[0].ofid === item.ofid) {
                                        tag = 1
                                        index = ind
                                    }
                                })
                                if (tag) {
                                    if (this.state.ofDetails !== null && this.state.ofDetails[index].user !== undefined && this.state.ofDetails[index].commodityDetails !== undefined) {
                                        const user = this.state.ofDetails[index].user
                                        const commodityDetails = this.state.ofDetails[index].commodityDetails
                                        return <div className="sub-order">
                                            <p>用户收货地址: {user.address} {user.uname} {user.phone} </p>
                                            <p style={{ fontWeight: 600, fontSize: 14 }}>商品详情:</p>
                                            {commodityDetails.map(item => {
                                                return <div className="commodity-details" >
                                                    <div className="commodity-details-item" >编号: {item.cid}</div>
                                                    <div className="commodity-details-item" >名称: {item.commodityName}</div>
                                                    <div className="commodity-details-item" >数量: {item.count}</div>
                                                </div>
                                            })}
                                        </div>
                                    } else {
                                        return <Empty />
                                    }
                                }
                            },
                        }}
                    />
                </div>
            </div>

        )
    }
}
