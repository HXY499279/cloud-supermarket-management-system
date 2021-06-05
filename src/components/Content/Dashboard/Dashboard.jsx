import React, { Component } from 'react'
import { Card, Col, Row } from 'antd';
import './index.css';

export default class Dashboard extends Component {
    render() {
        return (
            <div className="site-card-wrapper contentWraper">
                <Row gutter={16}>
                    <Col span={6}>
                        <Card
                            title={`今日销售额：${1}`}
                            bordered={true}
                        >
                            总销售额：<br />
                            <div className='Card_data'>
                                ￥3400
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                    <Card
                            title={`今天新增：${1}`}
                            bordered={true}
                        >
                            待发货：<br />
                            <div className='Card_data'>
                                ￥3400
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            title={`用户数量：${1}`}
                            bordered={true}
                        >
                            购物车收藏数：<br />
                            <div className='Card_data'>
                                ￥3400
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                    <Card
                            title={`今日新增：${1}`}
                            bordered={true}
                        >
                            成交笔数：<br />
                            <div className='Card_data'>
                                ￥3400
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

