import React, { Component } from 'react'
import { Form, Input, InputNumber, Button, message, PageHeader, Select, Upload } from 'antd';
import { nanoid } from 'nanoid'
import axios from 'axios'
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
        subCategory: [],
    }

    property = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        beforeUpload: () => {
            return false
        },
        maxCount: 1
    };

    onFinish = (data) => {
            // 处理空格
            data.commodityName = data.commodityName.toString().replace(/\s/,'') 
            data.originalPlace = data.originalPlace.toString().replace(/\s/,'') 

            data.currentPrice = data.originalPrice
            data.status = "在售"
            data.salesVolume = 0
            data.file = data.file.file
            let formData = new FormData()
            formData.append("commodityName", data.commodityName)
            formData.append("inventory", data.inventory)
            formData.append("originalPrice", data.originalPrice)
            formData.append("currentPrice", data.currentPrice)
            formData.append("originalPlace", data.originalPlace)
            formData.append("weight", data.weight)
            formData.append("category", data.category)
            formData.append("status", data.status)
            formData.append("salesVolume", data.salesVolume)
            formData.append("file", data.file)
            axios({
                // 后端接口
                url: '/addcommodity',
                method: 'post',
                // 传递给后端的数据
                data: formData,
            })
                .then(res => {
                    console.log(res)
                    message.success("商品添加成功！")
                    window.location.href = '/home/cim'
                }, () => {
                    message.error("商品添加失败！")
                })
    };

    // 渲染分类下拉框的选项
    showCategoryList = () => {
        return this.state.subCategory.map((item, index) => {
            return <Option value={`${item.category}`} key={nanoid()}>{item.category}</Option>
        })
    }

    // 获取下拉框的值
    categorySelectChange = (e) => {
        this.categorySelect.value = e
    }

    handleFileChange = (e) => {
        console.log(e.target.files[0])
    }

    componentDidMount = () => {
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
                        rules={[{ required: true, message: '请选择商品分类！' }]}
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
                        hidden
                        name="status"
                    >
                        <Input value="" />
                    </Form.Item>

                    <Form.Item
                        hidden
                        label="商品售价"
                        name="currentPrice"
                    // required={false}
                    // rules={[{ required: true, message: '请输入商品售价！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品价格"
                        name="originalPrice"
                        required={false}
                        rules={[{ required: true, message: '请输入商品原价！' }]}
                    >
                        <InputNumber className="input-number" min={0} />
                    </Form.Item>


                    <Form.Item
                        label="商品库存"
                        name="inventory"
                        required={false}
                        rules={[{ required: true, message: '请输入商品库存！' }]}
                    >
                        <InputNumber className="input-number" min={0} />
                    </Form.Item>

                    <Form.Item
                        hidden
                        name="salesVolume"
                    >
                        <Input value="" />
                    </Form.Item>

                    <Form.Item
                        label="商品规格"
                        name="weight"
                        required={false}
                        rules={[{ required: true, message: '请输入商品规格！' }]}
                    >
                        <InputNumber className="input-number" min={0}/>
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
                        name="file"
                        required={false}
                        rules={[{ required: true, message: '请上传商品图片！' }]}
                    >
                        <Upload {...this.property}>
                            <Button
                                type="primary"
                                size="middle"
                                style={{ borderRadius: 5 }}
                            >
                                上传图片
                            </Button>
                        </Upload>
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
