import React, { Component } from 'react'
import { Form, Input, Button, message, PageHeader } from 'antd';
import './index.css'
import reqwest from 'reqwest';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};

export default class AdmAddAd extends Component {

    onFinish = (data) => {
        console.log(data)
        if ( data.adCompany.search(/\s/) === -1 &&  data.adName.search(/\s/) === -1 && data.category.search(/\s/) === -1 && data.picture.search(/\s/) === -1) {
            reqwest({
                // 后端接口
                url: '/addad',
                method: 'post',
                type: 'json',
                // 传递给后端的数据
                data: data,
            })
                .then(res => {
                    console.log(res)
                    message.success("广告添加成功！")
                    window.location.href = '/home/adm'
                }, () => {
                    message.error("广告添加失败！")
                })
        } else {
            message.warning("输入内容不能含有空格！")
        }
    }

    render() {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => { window.location.href = '/home/adm' }}
                    subTitle="广告投放管理/新增广告"
                    style={{ paddingLeft: 10, backgroundColor: 'white' }}
                />
                <Form
                    {...layout}
                    id="addAdForm"
                    name="basic"
                    size="large"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        label="广告公司"
                        name="adCompany"
                        required={false}
                        rules={[{ required: true, message: '请输入广告公司名称！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="广告名称"
                        name="adName"
                        required={false}
                        rules={[{ required: true, message: '请输入广告名称！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="所属分类"
                        name="category"
                        required={false}
                        rules={[{ required: true, message: '请输入广告分类！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="图片地址"
                        name="picture"
                        required={false}
                        rules={[{ required: true, message: '请输入广告图片地址！' }]}
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
