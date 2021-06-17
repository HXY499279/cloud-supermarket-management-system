let ofStatusToChinese = (arr) => {
    arr.forEach(item => {
        console.log(item.status)
        if (item.status === undefined) {
            switch (item.item) {
                case "willDelivery":
                    item.item = "待发货"
                    break;
                case "delivery":
                    item.item = "配送中"
                    break;
                case "success":
                    item.item = "已成交"
                    break;
                case "refund":
                    item.item = "待退款"
                    break;
                case "refunded":
                    item.item = "已退款"
                    break;
                case "totalSuccess":
                    item.item = "总成交数"
                    break;
                case "totalRefunded":
                    item.item = "总失败数"
                    break;
                default:
                    return
            }
        } else {
            switch (item.status) {
                case "willdelivery":
                    item.status = "待发货"
                    break;
                case "delivery":
                    item.status = "配送中"
                    break;
                case "success":
                    item.status = "已成交"
                    break;
                case "refund":
                    item.status = "待退款"
                    break;
                case "refunded":
                    item.status = "已退款"
                    break;
                default:
                    return
            }
        }
    })

}
export default ofStatusToChinese