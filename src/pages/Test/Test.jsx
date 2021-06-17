import React, { Component } from 'react'
import {  Upload, message, Button } from 'antd'

const props = {
    name: 'file',
    action: '/modifyad',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

export default class Test extends Component {
    render() {
        return (
            <div>
                <Upload {...props}>
                    <Button type="primary">Click to Upload</Button>
                </Upload>
            </div>
        )
    }
}

