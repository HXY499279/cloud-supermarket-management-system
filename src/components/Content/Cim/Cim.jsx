import React, { Component, Fragment } from 'react'
import { Descriptions, Divider, Breadcrumb, Button, Input, message, InputNumber, Empty, Tag, Select, Col, Row, Space, Affix } from 'antd';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { DownOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import './index.css'
import reqwest from 'reqwest';
import CommodityCard from '../../../utils/CimCommodityCard/CommodityCard'
import CimAddCommodity from '../../../utils/CimAddCommodity/CimAddCommodity'

const { Option } = Select;

export default class Cim extends Component {
    state = {
        commodityData: [],
        subCategory: []
    }
    // 删除操作，请求数据库重新渲染数据到页面
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
    // 展示商品列表
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
    // 搜索商品
    CimSearch = () => {
        let [id, commodityName = ' ', category = ' ', status] = [
            this.idInput.value,
            this.nameInput.state.value,
            this.categorySelect.value,
            (undefined === this.statusSelect.value) ? this.statusSelect.props.defaultValue : this.statusSelect.value
        ]
        // 去除搜索内容中的空格，常见标点符号
        function reg(str) {
            str = str.replace(/\s/g, ',')
            str = str.split(/[,，；;.。]/g)
            let string = ''
            str = str.map(item => {
                if (item !== '') {
                    string += (item)
                }
            })
            return string
        }
        commodityName = reg(commodityName)
        category = reg(category)
        if (id !== '') {
            id *= 1
        }
        const searchCondition = { id, commodityName, category, status }
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
    // 获取下拉框的值
    statusSelectChange = (e) => {
        console.log(e)
        this.statusSelect.value = e
    }
    categorySelectChange = (e) => {
        console.log(e)
        this.categorySelect.value = e
    }
    // 渲染分类下拉框的选项
    showCategoryList = () => {
        return this.state.subCategory.map((item, index) => {
            console.log(item.category)
            return <Option value={`${item.category}`} key={nanoid()}>{item.category}</Option>
        })
    }
    // 渲染初始商品操作页面
    showCommodityInit = () => {
        return <>
            <Affix>
                <div className="search">
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
                            <Select
                                name='category'
                                style={{ width: 100 }}
                                ref={elev => { this.categorySelect = elev }}
                                onChange={this.categorySelectChange}
                            >
                                {this.showCategoryList()}
                            </Select >
                        </div>
                        <div>
                            商品状态:
                            <Select
                                name='status'
                                style={{ width: 100 }}
                                defaultValue='onsale'
                                ref={elev => { this.statusSelect = elev }}
                                onChange={this.statusSelectChange}
                            >
                                <Option value="onsale">在售</Option>
                                <Option value="soldout">下架</Option>
                            </Select >
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={this.CimSearch} />
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <Button type="primary" style={{ borderRadius: 5 }}>
                                <Link to="/home/cim/addcommodity">
                                    添加商品
                                </Link>
                            </Button>
                        </div>
                    </Space>
                </div>
            </Affix>
            <div className="contentWraper">
                <div style={{ padding: '0 0PX' }}>
                    {/* {console.log(this.state.commodityData)} */}
                    {(undefined === this.state.commodityData[0]) ? <Empty style={{ paddingTop: 150 }} /> :
                        <Row gutter={10} style={{ marginLeft: 10 }}>
                            {
                                this.showCommodity()
                            }
                        </Row>
                    }
                </div>
            </div>
        </>
    }

    componentDidMount = () => {
        // 请求商品列表
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
        // 请求分类列表
        reqwest({
            url: '/category/subcategory',
            method: 'get',
            type: 'json'
        })
            .then(res => {
                // console.log(res.results)
                this.setState({
                    subCategory: res.results
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
                <BrowserRouter>
                    <Switch>
                        <Route path="/home/cim/addcommodity" component={CimAddCommodity} />
                        <Route path="/home/cim" component={this.showCommodityInit} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
