import React, { Component } from 'react'
import { Form, Input, Button, message, PageHeader, Select } from 'antd';
import { nanoid } from 'nanoid'
import './index.css'
import reqwest from 'reqwest';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};

const { Option } = Select;


export default class CimAddCommodity extends Component {

    state = {
        subCategory: []
    }

    onFinish = (data) => {
        console.log(data)
        if (
            data.commodityName.search(/\s/) === -1 &&
            data.inventory.search(/\s/) === -1 &&
            data.originalPlace.search(/\s/) === -1 &&
            data.originalPrice.search(/\s/) === -1 &&
            data.originalPlace.search(/\s/) === -1 &&
            data.src.search(/\s/) === -1 &&
            data.weight.search(/\s/) === -1
        ) {
            reqwest({
                // 后端接口
                url: '/addcommodity',
                method: 'post',
                type: 'json',
                // 传递给后端的数据
                data: data,
            })
                .then(res => {
                    console.log(res)
                    message.success("商品添加成功！")
                    // window.location.href = '/home/cim'
                }, () => {
                    message.error("商品添加失败！")
                })
        } else {
            message.warning("输入内容不能含有空格！")
        }
    };

    // 渲染分类下拉框的选项
    showCategoryList = () => {
        return this.state.subCategory.map((item, index) => {
            return <Option value={`${item.categoryName}`} key={nanoid()}>{item.categoryName}</Option>
        })
    }

    // 获取下拉框的值
    categorySelectChange = (e) => {
        console.log(e)
        this.categorySelect.value = e
    }

    componentDidMount = () => {
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
            <div className="contentWraper" style={{ minHeight: 0 }}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => { window.location.href = '/home/cim' }}
                    subTitle="商品信息管理/新增商品"
                    style={{ paddingLeft: 10, backgroundColor: 'white' }}
                />
                <Form
                    {...layout}
                    id="addCommodityForm"
                    name="basic"
                    size="large"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        label="商品名称"
                        name="commodityName"
                        required={false}
                        rules={[{ required: true, message: '请输入商品名称！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品分类"
                        name="category"
                        required={false}
                        rules={[{ required: true, message: '请输入商品分类！' }]}
                    >
                        <Select
                            name='category'
                            style={{ width: '100%' }}
                            // defaultValue='onsale'
                            ref={elev => { this.categorySelect = elev }}
                            onChange={this.categorySelectChange}
                        >
                            {this.showCategoryList()}
                        </Select >
                    </Form.Item>

                    <Form.Item
                        label="商品价格"
                        name="originalPrice"
                        required={false}
                        rules={[{ required: true, message: '请输入商品价格！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品库存"
                        name="inventory"
                        required={false}
                        rules={[{ required: true, message: '请输入商品库存！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品规格"
                        name="weight"
                        required={false}
                        rules={[{ required: true, message: '请输入商品规格！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品产地"
                        name="originalPlace"
                        required={false}
                        rules={[{ required: true, message: '请输入商品产地！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品图片"
                        name="src"
                        required={false}
                        rules={[{ required: true, message: '请输入商品图片地址！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" style={{ borderRadius: 5 }}>
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        )
    }
}
