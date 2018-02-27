import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const { Search } = Input;
const columns = [
  {
    title: '类型名称',
    dataIndex: 'name'
  },
  {
    title: '排序',
    dataIndex: 'level'
  },
  {
    title: '类型图片'
  },
  {
    title: '操作',
    render: () => (
    	<Fragment>
        <a href="">编辑</a>
      </Fragment>
    )
  }
];

@connect(({ mall }) => ({
  mall
}))
class GoodsType extends PureComponent {

  state = {
    selectedRows: []
  };

  render() {
    const { mall } = this.props;
    const { selectedRows } = this.state;
    console.log('mall ', mall);
    const list = mall.goodsType;
    const pagination = {
      current: mall.page + 1,
      pageSize: mall.limit,
      total: mall.count
    };
    const data = { list, pagination };
    return (
      <PageHeaderLayout title="商品类型列表">
        <Card bordered={false}>
          <div>
            <Button type="primary" style={{marginBottom: '10px'}}>添加类型</Button>
            <StandardTable
              selectedRows={selectedRows}
              columns={columns}
              data={data}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default GoodsType;
