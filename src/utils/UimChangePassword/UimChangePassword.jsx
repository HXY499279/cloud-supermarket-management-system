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
                uid: 1,
                account: "",
                upassword: ""
            }
        }

    }

    onFinish = (predata, newdata) => {
        if (newdata.modifiedpassword === predata.upassword) {
            message.warning("密码未修改！")
        } else {
            console.log(newdata)
            reqwest({
                // 后端接口
                url: '/modifypassword',
                method: 'post',
                type: 'json',
                // 传递给后端的数据
                data: newdata,
            })
                .then(res => {
                    if (res.status === 'success') {
                        message.success("密码修改成功！")
                        window.location.href = '/home/uim'
                    } else {
                        message.error("密码修改失败！")
                        window.location.href = '/home/uim'
                    }
                })
        }
    };

    componentWillMount = () => {
        console.log(this.props)
        this.setState({
            data: this.props.data[0]
        })
    }

    render() {
        const { data = {
            uid: 1,
            account: "",
            upassword: ""
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
                        label="uid"
                        name="uid"
                        required={false}
                        initialValue={`${data.uid}`}
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
                        initialValue={`${data.upassword}`}
                    >
                        <Input.Password  />
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
