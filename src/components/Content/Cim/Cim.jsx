import React, { Component, Fragment } from 'react'
import { Descriptions, Divider, Breadcrumb, Button, Input, message, InputNumber, Empty, Tag, Select, Col, Row, Space, Affix } from 'antd';
import { DownOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import './index.css'
import reqwest from 'reqwest';
import CommodityCard from '../../../utils/CimCommodityCard/CommodityCard'

const { Option } = Select;

export default class Cim extends Component {
    state = {
        commodityData: []
    }

    renderCommodityList = (id) => {
        console.log(this.state.commodityData)
        reqwest({
            url: '/deletecommodity',
            method: 'post',
            type: 'json',
            data: { id }
        })
            .then(res => {
                this.setState({
                    commodityData: res.results
                })
                message.success('删除成功');
            }, () => {
                message.error('删除失败');
            })
    }

    showCommodity = () => {
        return this.state.commodityData.map((item, index) => {
            return (
                // 循环项的key值，不要用index，可以用nanoid来设置
                <Col span={6} style={{ marginBottom: 20 }} key={nanoid()} >
                    <CommodityCard data={item} renderCommodityList={this.renderCommodityList} />
                </Col>
            )
        })
    }

    CimSearch = () => {
        const [id = '', commodityName = '', category = '', status] = [
            this.idInput.value * 1,
            this.nameInput.state.value,
            this.categoryInput.state.value,
            (undefined === this.statusSelect.value) ? this.statusSelect.props.defaultValue : this.statusSelect.value
        ]
        let searchCondition = { id, commodityName, category, status }
        console.log(searchCondition)
        reqwest({
            url: '/searchcommodity',
            method: 'post',
            type: 'json',
            data: searchCondition
        })
            .then(res => {
                console.log(res)
                this.setState({
                    commodityData: res
                })
            })
    }

    selectChange = (e) => {
        console.log(e)
        this.statusSelect.value = e
    }

    componentDidMount = () => {
        reqwest({
            url: '/commoditylist',
            method: 'get',
            type: 'json'
        })
            .then(res => {
                // console.log(res.results)
                this.setState({
                    commodityData: res.results
                })
            })
    }

    render() {
        return (
            <div>
                <Divider style={{ margin: 0 }} />
                <div className="descwraper">
                    <Breadcrumb className="bdc">
                        <Breadcrumb.Item>
                            <a href="/home">主页</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>商品信息管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <Descriptions title="商品管理" className="desc">
                        <Descriptions.Item>仓库商品信息展示，可以进行新增商品，搜索商品，编辑商品，删除商品操作</Descriptions.Item>
                    </Descriptions>
                </div>
                <Affix>
                    <div id="search">
                        <Divider style={{ margin: 0 }} />
                        <Space style={{ marginTop: 20 }} size={20}>
                            <div>
                                id:
                            <InputNumber name='id' className="CimInput" ref={elev => { this.idInput = elev }} />
                            </div>
                            <div>
                                商品名称:
                            <Input name="commodity" className="CimInput" ref={elev => { this.nameInput = elev }} />
                            </div>
                            <div>
                                分类:
                            <Input name='category' className="CimInput" ref={elev => { this.categoryInput = elev }} />
                            </div>
                            <div>
                                商品状态:
                            <Select
                                    name='status'
                                    style={{ width: 100 }}
                                    defaultValue='onsale'
                                    ref={elev => { this.statusSelect = elev }}
                                    onChange={this.selectChange}
                                >
                                    <Option value="onsale">在售</Option>
                                    <Option value="soldout">下架</Option>
                                </Select >
                            </div>
                            <div style={{ marginLeft: 20 }}>
                                <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={this.CimSearch} />
                            </div>
                        </Space>
                    </div>
                </Affix>
                <div className="contentWraper">
                    <div style={{ padding: '0 0PX' }}>
                        {console.log(this.state.commodityData)}
                        {(undefined === this.state.commodityData[0]) ? <Empty style={{paddingTop:150}}/> :
                            <Row gutter={10} style={{ marginLeft: 10 }}>
                                {
                                    this.showCommodity()
                                }
                            </Row>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
