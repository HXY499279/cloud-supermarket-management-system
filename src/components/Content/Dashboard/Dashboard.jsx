import React, { Component } from 'react'
import { Card, Col, Row, Space, Button } from 'antd';
import { Chart } from '@antv/g2';
import './index.css';

export default class Dashboard extends Component {

    state = {

    }

    componentDidMount() {
        let timer1 = setTimeout(() => {
            const data = [
                { item: '事例一', count: 40, percent: 0.4 },
                { item: '事例二', count: 21, percent: 0.21 },
                { item: '事例三', count: 17, percent: 0.17 },
                { item: '事例四', count: 13, percent: 0.13 },
                { item: '事例五', count: 9, percent: 0.09 },
            ];

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
            const data = [
                { item: '事例一', count: 40, percent: 0.4 },
                { item: '事例二', count: 21, percent: 0.21 },
                { item: '事例三', count: 17, percent: 0.17 },
                { item: '事例四', count: 13, percent: 0.13 },
                { item: '事例五', count: 9, percent: 0.09 },
            ];

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
    }


    render() {
        return (
            <div className="contentWraper">
                <div className="site-card-wrapper ">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card
                                className="data-card"
                                title={`今日新增：${341}元`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                    总销售额：<br />
                                    <div className='Card_data'>
                                        {`3400`}元
                                </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                title={`今日新增：${6}`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                    总待发货数：<br />
                                    <div className='Card_data'>
                                        {`32`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                title={`今日新增：${1}`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                    总退款数：<br />
                                    <div className='Card_data'>
                                        {`40`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                title={`今日新增：${10}`}
                                bordered={true}
                            >
                                <div className="dataCard">
                                    成交笔数：<br />
                                    <div className='Card_data'>
                                        {`400`}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div className="chart-rule">
                    <div className="chart-wraper">
                        <div className="chart-title" >订单情况概要</div>
                        <div id="order-from-details"></div>
                    </div>
                    <div className="chart-wraper">
                        <div className="chart-title">订单成功率</div>
                        <div id="order-finish-rate"></div>
                    </div>
                </div>
            </div>

        )
    }
}

