import React, { Component } from 'react'
import { Card, Col, Row } from 'antd';
import { Chart } from '@antv/g2';
import reqwest from 'reqwest'
import './index.css';
// 引用工具
import ofStatusToChinese from '../../../utils/ofStatusToChinese';
import numberRefular from '../../../utils/numberRegular';

export default class Dashboard extends Component {

    state = {
        results: {

        }
    }

    componentDidMount() {
        reqwest({
            url: "/dashboard/showdashboard",
            type: "json",
            method: "get",
        })
            .then(res => {
                console.log(res)
                // 处理数据
                let ofDetail = {
                    sales: {
                        totalSales: res.totalSales,
                        todaySale: res.todaySale
                    },
                    willDelivery: {
                        totalWillDelivery: res.willDelivery,
                    },
                    delivery: {
                        totalDelivery: res.delivery,
                    },
                    refund: {
                        totalRefund: res.refund,
                    },
                    refunded: {
                        totalRefunded: res.refunded,
                    },
                    success: {
                        totalSuccess: res.success,
                    }
                }
                let totalof = res.willDelivery + res.delivery + res.success + res.refund + res.refunded
                console.log(typeof (res.willDelivery * 1.0 / totalof).toFixed(4))
                let ofSummary = [
                    {
                        item: "willDelivery",
                        count: res.willDelivery,
                        percent: numberRefular(res.willDelivery * 1.0 / totalof)
                    },
                    {
                        item: "delivery",
                        count: res.delivery,
                        percent: numberRefular(res.delivery * 1.0 / totalof)
                    },
                    {
                        item: "success",
                        count: res.success,
                        percent: numberRefular(res.success * 1.0 / totalof)
                    },
                    {
                        item: "refund",
                        count: res.refund,
                        percent: numberRefular(res.refund * 1.0 / totalof)
                    },
                    {
                        item: "refunded",
                        count: res.refunded,
                        percent: numberRefular(res.refunded * 1.0 / totalof)
                    }
                ]
                let totalFinishedof = res.success + res.refunded
                let ofSuccessRate = [
                    {
                        item: "totalSuccess",
                        count: res.success,
                        percent: numberRefular(res.success / totalFinishedof)
                    },
                    {
                        item: "totalRefunded",
                        count: res.refunded,
                        percent: numberRefular(res.refunded / totalFinishedof)
                    }
                ]
                ofStatusToChinese(ofSummary)
                ofStatusToChinese(ofSuccessRate)
                let results = {
                    ofDetail,
                    ofSummary,
                    ofSuccessRate
                }
                this.setState({
                    results: results
                }, () => {
                    const results = this.state.results
                    let timer1 = setTimeout(() => {
                        const data = results.ofSummary;

                        const chart = new Chart({
                            container: 'order-from-details',
                            autoFit: true,
                            height: 300,
                            width: 630
                        });

                        chart.coordinate('theta', {
                            radius: 0.75,
                        });

                        chart.data(data);

                        chart.scale('percent', {
                            formatter: (val) => {
                                val = val * 100 + '%';
                                return val;
                            },
                        });

                        chart.tooltip({
                            showTitle: false,
                            showMarkers: false,
                        });

                        chart
                            .interval()
                            .position('percent')
                            .color('item')
                            .label('percent', {
                                content: (data) => {
                                    return `${data.item}: ${data.percent * 100}%`;
                                },
                            })
                            .adjust('stack');

                        chart.interaction('element-active');

                        chart.render();

                        clearTimeout(timer1)

                    }, 0);

                    let timer2 = setTimeout(() => {
                        const data = results.ofSuccessRate;

                        const chart = new Chart({
                            container: 'order-finish-rate',
                            autoFit: true,
                            height: 300,
                            width: 630

                        });

                        chart.coordinate('theta', {
                            radius: 0.75,
                        });

                        chart.data(data);

                        chart.scale('percent', {
                            formatter: (val) => {
                                val = val * 100 + '%';
                                return val;
                            },
                        });

                        chart.tooltip({
                            showTitle: false,
                            showMarkers: false,
                        });

                        chart
                            .interval()
                            .position('percent')
                            .color('item')
                            .label('percent', {
                                content: (data) => {
                                    return `${data.item}: ${data.percent * 100}%`;
                                },
                            })
                            .adjust('stack');

                        chart.interaction('element-active');

                        chart.render();

                        clearTimeout(timer2)

                    }, 0);

                })
            })
    }


    render() {
        const ofDetail = this.state.results.ofDetail
        console.log(ofDetail, this.state.results)
        return (
            <div className="contentWraper">
                <div className="site-card-wrapper ">
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card
                                className="data-card"
                                title={`今日新增：${(undefined === ofDetail) ? 0 : ofDetail.sales.todaySale}元`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                    总销售额：<br />
                                    <div className='Card_data'>
                                        {`${(undefined === ofDetail) ? 0 : ofDetail.sales.totalSales}`}元
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                title={`待发货`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                    累计数量：<br />
                                    <div className='Card_data'>
                                        {`${(undefined === ofDetail) ? 0 : ofDetail.willDelivery.totalWillDelivery}`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                title={`配送中`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                累计数量：<br />
                                    <div className='Card_data'>
                                        {`${(undefined === ofDetail) ? 0 : ofDetail.delivery.totalDelivery}`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                title={`待退款`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                累计数量：<br />
                                    <div className='Card_data'>
                                        {`${(undefined === ofDetail) ? 0 : ofDetail.refund.totalRefund}`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                title={`已退款`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                累计数量：<br />
                                    <div className='Card_data'>
                                        {`${(undefined === ofDetail) ? 0 : ofDetail.refunded.totalRefunded}`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                title={`已成交`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                累计数量：<br />
                                    <div className='Card_data'>
                                        {`${(undefined === ofDetail) ? 0 : ofDetail.success.totalSuccess}`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div className="chart-rule">
                    <div className="chart-wraper">
                        <div className="chart-title" >订单状态比率</div>
                        <div id="order-from-details"></div>
                    </div>
                    <div className="chart-wraper">
                        <div className="chart-title">订单成败比率</div>
                        <div id="order-finish-rate"></div>
                    </div>
                </div>
            </div>

        )
    }
}

