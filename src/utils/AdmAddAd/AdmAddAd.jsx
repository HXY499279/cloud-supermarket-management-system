import React, { Component } from 'react'
import { Form, Input, Button, message, PageHeader, Upload } from 'antd';
import './index.css'
import axios from 'axios'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};

export default class AdmAddAd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            file: '',
            adid: '',
            adNumber: props
        }
        console.log(props)
    }

    property = {
        name: 'file',
        headers: {
            authorization: 'authorization-text'
        },
        beforeUpload: () => {
            return false
        },
        maxCount: 1
    };

    uploadTheadid = () => {

    }

    onFinish = (data) => {
        if (data.adCompany.search(/\s/) === -1 && data.adName.search(/\s/) === -1 && data.category.search(/\s/) === -1) {
            let formData = new FormData()
            formData.append("file", data.file.file);
            formData.append("adCompany", data.adCompany);
            formData.append("adName", data.adName);
            formData.append("category", data.category)
            // console.log(data.file)
            // console.log(formData.get("file"))

            axios({
                // 后端接口
                url: '/addad',
                method: 'post',
                // 传递给后端的数据
                data: formData,
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
        return (this.state.adNumber >= 3) ? (window.location.href = "/home/adm") : (
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
                    encType="multipart/form-data"
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
                        name="file"
                        required={false}
                        rules={[{ required: true, message: '请输入广告图片地址！' }]}
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
