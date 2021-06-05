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
    };

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

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="广告名称"
                        name="adName"
                        required={false}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="所属分类"
                        name="category"
                        required={false}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="图片地址"
                        name="picture"
                        required={false}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
