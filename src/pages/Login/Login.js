import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, message, Image } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import axios from 'axios'
import pic from '../../assets/2.jpg'

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 50 },
};
const tailLayout = {
    wrapperCol: { offset: 0, span: 10 },
};

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            admin: {
                // 待更改-----------------------------------------------------------------------------
                asname: '',
                password: ''
                // 待更改-----------------------------------------------------------------------------
            },
            status: ''
        }
    }

    submitHandle = () => {
        // console.log(this.nameElem.props.value)
        // console.log(this.passwordElem.props.value)
        if (this.nameElem.props.value !== undefined && this.passwordElem.props.value !== undefined) {
            let admin = this.state.admin
            admin.asname = this.nameElem.props.value
            admin.password = this.passwordElem.props.value
            this.setState({
                admin
            })
            // 待更改-----------------------------------------------------------------------------
            axios.post('/login', this.state.admin)
                // 待更改-----------------------------------------------------------------------------
                .then((res) => {
                    console.log(res)
                    this.setState({
                        // 待更改-----------------------------------------------------------------------------
                        status: res.data.status
                        // 待更改-----------------------------------------------------------------------------
                    }, () => {
                        let status = this.state.status
                        // 待更改-----------------------------------------------------------------------------
                        if (status === 'success') {
                            // 待更改-----------------------------------------------------------------------------
                            message.success("登陆成功！")
                            let adminObj = JSON.stringify(this.state.admin)
                            // console.log(adminObj)
                            sessionStorage.setItem("admin", adminObj)
                            window.location.href = "./home"
                        } else {
                            message.error("账号或密码错误！")
                            this.nameElem.input.value = ''
                            this.passwordElem.input.value = ''

                        }
                    })

                })
                .catch(err => {
                    message.error("服务器出错！")
                })
        }
    }

    render() {
        return (
            <div>
                <Image id="pageLogin" src={pic} preview={false} />
                <div id="formWrap">
                    <p className="login-p" style={{ color: 'white', fontSize: 18 }}>请使用您的账号密码登录系统</p>
                    <Form
                        initialValues={{ remember: true }}
                        {...layout}
                    >
                        <Form.Item
                            name="asname"
                            rules={[{ required: true, message: '请输入你的用户名！' }]}
                        >
                            <Input ref={input => { this.nameElem = input }} style={{ borderRadius: 7 }} placeholder='请输入账号' />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入你的密码！' }]}
                        >
                            <Input.Password ref={input => { this.passwordElem = input }} style={{ borderRadius: 7 }}  placeholder='请输入密码' />
                        </Form.Item>

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox style={{ color: 'white' }}>记住密码</Checkbox>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" id="submit" onClick={this.submitHandle} style={{ borderRadius: 7 }}>
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="login-p" style={{ color: 'white' }}>CQUPT-Supermarket-Management-System</p>
                    <p className="login-p" style={{ color: 'white' }}>Designed By LTH</p>
                </div>

            </div>
        )
    }
}
