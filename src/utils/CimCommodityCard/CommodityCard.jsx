import React, { Component } from 'react'
import { Card, Divider, Input, Popconfirm, Button, message } from 'antd';
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
    delete = (id) => {
        console.log(typeof id)
        this.props.renderCommodityList(id)
    }
    // 确认编辑操作,发送表单请求到后端
    comfimEdit = () => {
        const [
            id,
            currentPrice,
            inventory,
            weight,
            category,
            originalPrice,
            salesVolume,
            originalPlace
        ] = [
                this.state.data.id,
                this.currentPriceElev.state.value,
                this.inventoryElev.state.value,
                this.weightElev.state.value,
                this.categoryElev.state.value,
                this.originalPriceElev.state.value,
                this.salesVolumeElev.state.value,
                this.originalPlaceElev.state.value
            ]
        const data = {
            id,
            currentPrice,
            inventory,
            weight,
            category,
            originalPrice,
            salesVolume,
            originalPlace
        }
        console.log(data)
        reqwest({
            url: '/editcommodity',
            method: 'post',
            type: 'json',
            data: data
        })
            .then(res => {
                this.setState({
                    data: res[0],
                    isEdit: false
                })
                message.success("更改成功！")
            },() => {
                message.error("更改失败！")
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
        const isEdit = this.state.isEdit
        return (
            <Card
                style={{ width: 307, height: 375, margin: '0 auto' }}
                cover={
                    <img
                        alt="example"
                        src={item.src}
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
                        onConfirm={this.delete.bind(this, item.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <CloseOutlined key="ellipsis" />
                    </Popconfirm>
                ]}
            // loading={true}
            >
                <p style={{ margin: '10PX 0 0 0 ', fontWeight: 900, fontSize: 18 }}>{item.commodityName}</p>
                <div className='detailWraper'>
                    <div className='detail'>编号: {item.id}
                    </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>现价: {this.propertyEdit('currentPrice')}元</div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>库存: {this.propertyEdit('inventory')}件 </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>规格: {this.propertyEdit('weight')}g </div>
                </div>
                <div className='detailWraper'>
                    <div className='detail'>分类: {this.propertyEdit('category')} </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>原价: {this.propertyEdit('originalPrice')}元 </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>销量: {this.propertyEdit('salesVolume')}件 </div>
                    <Divider style={{ margin: 0 }} />
                    <div className='detail'>产地: {this.propertyEdit('originalPlace')} </div>
                </div>
            </Card>
        )
    }
}
