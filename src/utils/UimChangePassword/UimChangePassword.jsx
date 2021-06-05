import React, { Component } from 'react'
import { Form, Input, Button, message, PageHeader } from 'antd';
import './index.css'
import reqwest from 'reqwest';

const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 5 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
};


export default class UimChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                id: 1,
                account: "",
                password: ""
            }
        }

    }

    onFinish = (predata, newdata) => {
        if (newdata.modifiedpassword === predata.password) {
            message.warning("密码未修改！")
        } else {
            reqwest({
                // 后端接口
                url: '/modifypassword',
                method: 'post',
                type: 'json',
                // 传递给后端的数据
                data: newdata,
            })
                .then(res => {
                    console.log(res)
                    message.success("密码修改成功！")
                    window.location.href = '/home/uim'
                }, () => {
                    message.error("密码修改失败！")
                })
        }
    };

    componentWillMount = () => {
        this.setState({
            data: this.props.data[0]
        })
    }

    render() {
        const { data = {
            id: 1,
            account: "",
            password: ""
        } } = this.state
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => { window.location.href = '/home/uim' }}
                    subTitle="用户信息管理/修改用户密码"
                    style={{ paddingLeft: 10, backgroundColor: 'white' }}
                />
                {/* <div style={{ backgroundColor: 'white', paddingTop: 9, paddingLeft: 10 }}>
                    <Link to='/home/uim'>
                        <ArrowLeftOutlined style={{ fontSize: 20 }} />
                    </Link>
                </div> */}
                <Form
                    {...layout}
                    id="changePasswordFrom"
                    name="basic"
                    initialValues={{ remember: true }}
                    size='large'
                    onFinish={this.onFinish.bind(this, data)}
                >
                    <Form.Item
                        label="id"
                        name="id"
                        required={false}
                        initialValue={`${data.id}`}
                        hidden
                    >
                        <Input hidden />
                    </Form.Item>
                    <Form.Item
                        label="用户名称"
                        name="username"
                        required={false}
                        initialValue={`${data.account}`}
                    >
                        <Input hidden />
                        {data.account}
                    </Form.Item>

                    <Form.Item
                        label="用户密码"
                        name="modifiedpassword"
                        required={false}
                        initialValue={`${data.password}`}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ borderRadius: 5 }}
                        >
                            提交修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
