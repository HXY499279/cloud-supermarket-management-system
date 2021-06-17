import React, { Component } from 'react'
import { Card, Divider, Input, Popconfirm, Button, message, Image } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';
import './index.css'

export default class CommodityCard extends Component {
    state = {
        data: {},
        isEdit: false
    }

    edit = () => {
        this.setState({
            isEdit: true
        })

    }
    // 删除商品操作
    delete = (cid) => {
        console.log(typeof cid)
        this.props.renderCommodityList(cid)
    }
    // 确认编辑操作,发送表单请求到后端
    comfimEdit = () => {
        const [
            cid,
            currentPrice,
            inventory,
            originalPrice,
        ] = [
                this.state.data.cid,
                this.currentPriceElev.state.value,
                this.inventoryElev.state.value,
                this.originalPriceElev.state.value,
            ]
        const newData = {
            cid,
            currentPrice,
            inventory,
            originalPrice,
        }
        console.log(this.state.data)
        console.log(newData)
        reqwest({
            url: '/editcommodity',
            method: 'post',
            type: 'json',
            data: newData
        })
            .then(res => {
                if (res.status === "success") {
                    message.success("更改成功！")
                    console.log(this.state.data)
                    let oldData = this.state.data;
                    [
                        oldData.currentPrice,
                        oldData.inventory,
                        oldData.originalPrice,
                    ] = [
                            newData.currentPrice,
                            newData.inventory,
                            newData.originalPrice,
                        ]
                    this.setState({
                        data: oldData,
                        isEdit: false
                    })
                } else {
                    message.error("更改失败！")
                    let oldData = this.state.data;
                    this.setState({
                        data: oldData,
                        isEdit: false
                    })
                }
            })
    }
    // 属性函数化
    propertyEdit = (keyword) => {
        const item = this.state.data
        const isEdit = this.state.isEdit
        return (isEdit)
            ?
            <Input className='editInput' defaultValue={item[keyword]} onChange={this[`${keyword}Change`]} ref={elev => { this[`${keyword}Elev`] = elev }} />
            :
            item[keyword]
    }

    componentDidMount = () => {
        this.setState({
            data: this.props.data
        })
    }

    render() {
        const item = this.state.data
        if (item.src === undefined ) {
            // console.log(item)
        }
        const isEdit = this.state.isEdit
        return (
            <Card
                style={{ width: 307, height: 375, margin: '0 auto' }}
                cover={
                    <Image
                        alt="图片出错"
                        src={item.src}
                        height={186}
                        width={307}
                        preview={false}
                    />
                }
                actions={[
                    (isEdit)
                        ?
                        <Button type='primary' size="small" style={{ borderRadius: 5 }} onClick={this.comfimEdit}>确认</Button>
                        :
                        <EditOutlined key="edit" onClick={this.edit} />,
                    <Popconfirm
                        title="确定删除该商品吗?"
                        onConfirm={this.delete.bind(this, item.cid)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <CloseOutlined key="ellipsis" />
                    </Popconfirm>
                ]}
            // loading={true}
            >
                <p style={{ margin: '10PX 0 0 0 ', fontWeight: 900, fontSize: 18, textAlign: 'center' }}>{item.commodityName}</p>
                <div className='detailWraper'>
                    <div className='detail'>编号: {item.cid}
                    </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>现价: {this.propertyEdit('currentPrice')}元</div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>进货量: {this.propertyEdit('inventory')}件 </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>规格: {item.weight}g </div>
                </div>
                <div className='detailWraper'>
                    <div className='detail' title={item.category}>分类: {item.category} </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>原价: {this.propertyEdit('originalPrice')}元 </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>销量: {item.salesVolume}件 </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail' title={item.originalPlace}>产地: {item.originalPlace} </div>
                </div>
            </Card>
        )
    }
}
