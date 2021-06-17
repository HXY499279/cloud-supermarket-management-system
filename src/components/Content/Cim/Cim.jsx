import React, { Component } from 'react'
import { Descriptions, Divider, Breadcrumb, Button, Input, message, InputNumber, Empty, Select, Col, Row, Space, Affix } from 'antd';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroller';
import { nanoid } from 'nanoid'
import './index.css'
import reqwest from 'reqwest';
import CommodityCard from '../../../utils/CimCommodityCard/CommodityCard'
import CimAddCommodity from '../../../utils/CimAddCommodity/CimAddCommodity'

const { Option } = Select;

export default class Cim extends Component {

    state = {
        data: [],
        subCategory: [],
        loading: false,
        hasMore: true,
        total: '',
        isAddCategory: false,
        count: 0,
        pageSize: 8
    };

    fetchData = callback => {
        let count = this.state.count
        let pageSize = this.state.pageSize
        count += 1
        this.setState({
            count: count
        })
        let data = { count, pageSize }
        reqwest({
            url: '/commoditylist',
            type: 'json',
            method: 'post',
            data: data,
            success: res => {
                callback(res);
            },
        });
    };

    handleInfiniteOnLoad = () => {
        let { data, total } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length >= total) {
            message.warning('商品已展示完毕');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            data = data.concat(res.commodities);
            this.setState({
                data,
                loading: false,
                total: res.total
            });
        });
    };

    // 删除操作，请求数据库重新渲染数据到页面
    renderCommodityList = (cid) => {
        let count = this.state.count
        let pageSize = this.state.pageSize
        let end = count * pageSize
        reqwest({
            url: '/deletecommodity',
            method: 'post',
            type: 'json',
            data: { cid, end }
        })
            .then(res => {
                console.log(res)
                this.setState({
                    data: res.commodities
                })
                message.success('删除成功');
            }, () => {
                message.error('删除失败');
            })
    }
    // 展示商品列表
    showCommodity = () => {
        console.log(this.state.data)
        return this.state.data.map((item, index) => {
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
        let [cid, commodityName = ' ', category = ' ', status] = [
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
            str.forEach(item => {
                if (item !== '') {
                    string += (item)
                }
            })
            return string
        }
        commodityName = reg(commodityName)
        category = reg(category)
        if (cid !== '') {
            cid *= 1
        }
        const searchCondition = { cid, commodityName, category, status }
        console.log(searchCondition)
        reqwest({
            url: '/searchcommodity',
            method: 'post',
            type: 'json',
            data: searchCondition
        })
            .then(res => {
                console.log(res)
                if (res.status === 'success') {
                    this.setState({
                        data: res.commodities,
                        total:res.total
                    })
                    message.success("搜索成功！")
                } else {
                    message.error("查无该商品！")
                }

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
            // console.log(item.category)
            return <Option value={`${item.category}`} key={nanoid()}>{item.category}</Option>
        })
    }
    // 渲染初始商品操作页面
    showCommodityInit = () => {
        const Demo = () => {
            return (
                <div className="background">
                    <Affix target={() => this.commodityListElev}>
                        <div className="search">
                            <Divider style={{ margin: 0 }} />
                            <Space style={{ marginTop: 20 }} size={20}>
                                <div>
                                    商品编号:
                                    <InputNumber name='cid' className="CimInput" min={0} ref={elev => { this.idInput = elev }} />
                                </div>
                                <div>
                                    商品名称:
                                    <Input name="commodity" className="CimInput" ref={elev => { this.nameInput = elev }} />
                                </div>
                                <div>
                                    商品分类:
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
                                        defaultValue='在售'
                                        ref={elev => { this.statusSelect = elev }}
                                        onChange={this.statusSelectChange}
                                    >
                                        <Option value="在售">在售</Option>
                                        <Option value="已下架">已下架</Option>
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
                </div>
            );
        };
        return <>
            <Demo />
            <div className="contentWraper">
                <div style={{ padding: 0 }}>
                    {/* {console.log(this.state.data)} */}
                    {(undefined === this.state.data[0]) ? <Empty style={{ paddingTop: 150 }} /> :
                        <Row gutter={10} className="">
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
        console.log("页面初始渲染")
        this.fetchData(res => {
            console.log(res)
            this.setState({
                data: res.commodities,
                total: res.total
            });
        });
        // 请求分类列表
        reqwest({
            url: '/category/allcategory',
            method: 'get',
            type: 'json'
        })
            .then(res => {
                // console.log(res.results)
                this.setState({
                    subCategory: res
                })
            })
    }

    render() {
        return (
            <div className="content-scroll" ref={elev => { this.commodityListElev = elev }}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
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
                </InfiniteScroll>
            </div>
        )
    }
}
