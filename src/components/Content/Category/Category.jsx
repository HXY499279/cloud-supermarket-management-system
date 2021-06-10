import React, { Component } from 'react'
import { Descriptions, Divider, Breadcrumb, Popconfirm, Button, List, message, Space, Input, Spin } from 'antd';
import { Link } from 'react-router-dom'
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';
import { nanoid } from 'nanoid'
import './index.css'

export default class Category extends Component {

    state = {
        data: [],
        loading: false,
        hasMore: true,
        total: '',
        isAddCategory: false,
        reqCount: 0
    };

    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                data: res.results,
                total: res.total
            });
        });
    }

    fetchData = callback => {
        let reqCount = this.state.reqCount
        reqCount += 1
        this.setState({
            reqCount:reqCount
        })
        let data = {reqCount}
        data = JSON.stringify(data)
        reqwest({
            url: '/category/categorylist',
            type: 'json',
            method: 'post',
            data:data,
            contentType: 'application/json',
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
            message.warning('分类已展示完毕');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
                total: res.total
            });
        });
    };

    addCategory = () => {
        console.log(this.categoryInput.state.value)
        let category = this.categoryInput.state.value
        if (category !== undefined && category !== '' && category.search(/\s/) === -1) {
            reqwest({
                url: '/category/addcategory',
                method: 'post',
                type: 'json',
                data: { category },
                success: res => {
                    this.setState({
                        data: res.results
                    })
                    this.categoryInput.input.value = ''
                    this.categoryInput.state.value = ''
                    if (res.status === 'success') {
                        message.success("新增分类成功！")
                    } else {
                        message.error("新增分类失败！")
                    }
                }
            })
        } else {
            message.warning("输入内容不能为空或含有空格！")

        }
    }

    deleteCategory = (cateid) => {
        reqwest({
            url: '/category/deletecategory',
            method: 'post',
            type: 'json',
            data: { cateid },
            success: (res) => {
                this.setState({
                    data: res.results
                })
                if (res.status === 'success') {
                    message.success("删除分类成功！")
                } else {
                    message.error("删除分类失败！")
                }
            }
        })
    }

    AddCategoryIsTrue = () => {
        this.setState({
            isAddCategory: true
        })
    }

    AddCategoryIsFalse = () => {
        this.setState({
            isAddCategory: false
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
                        <Breadcrumb.Item>商品分类管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <Descriptions title="分类管理" className="desc">
                        <Descriptions.Item>商品分类展示，新增分类，删除分类</Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="search">
                    <Divider style={{ margin: 0 }} />
                    <Space style={{ marginTop: 20 }} size={20}>

                        {
                            (this.state.isAddCategory)
                                ?
                                <>
                                    <div>
                                        分类名称:
                                        <Input name='category' className="CimInput" ref={elev => { this.categoryInput = elev }} />
                                    </div>
                                    <Button
                                        type="primary"
                                        style={{ borderRadius: 5 }}
                                        onClick={this.addCategory}
                                    >
                                        确定
                                    </Button>
                                    <Button
                                        type="primary"
                                        danger
                                        style={{ borderRadius: 5 }}
                                        onClick={this.AddCategoryIsFalse}
                                    >
                                        取消
                                    </Button>
                                </>
                                :
                                <Button
                                    type="primary"
                                    style={{ borderRadius: 5 }}
                                    onClick={this.AddCategoryIsTrue}
                                >
                                    新增分类
                                </Button>

                        }
                    </Space>
                </div>
                <div className="contentWraper">
                    <div className="demo-infinite-container">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={this.handleInfiniteOnLoad}
                            hasMore={!this.state.loading && this.state.hasMore}
                            useWindow={false}
                        >
                            <List
                                dataSource={this.state.data}
                                renderItem={item => (
                                    <List.Item key={nanoid()}>
                                        <List.Item.Meta
                                            title={item.category}
                                            style={{fontSize:20}}
                                        />
                                        <Button
                                            type="primary"
                                            danger
                                            style={{ borderRadius: 5 }}
                                        >
                                            <Popconfirm
                                                title="确定删除该分类吗?"
                                                onConfirm={this.deleteCategory.bind(this, item.cateid)}
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                删除分类
                                            </Popconfirm>
                                        </Button>
                                    </List.Item>
                                )}
                            >
                                {this.state.loading && this.state.hasMore && (
                                    <div className="demo-loading-container">
                                        <Spin />
                                    </div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        )
    }
}
