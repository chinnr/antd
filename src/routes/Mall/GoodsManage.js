import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Input, Button } from 'antd';
import GoodsManageTable from './GoodsManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
class GoodsManage extends PureComponent {

  state = {
    selectedRows: []
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows
    });
  };

  handleTableChange = (n) => {
    console.log('n is ', n)
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsList',
      payload: {
        page: n.current - 1,
        limit: 10,
        sort:["-createdAt"]
      }
    })
  };

  render() {
    const { mall, loading } = this.props;
    const { selectedRows } = this.state;
    const list = mall.goodsList;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '原价',
        dataIndex: 'originalPrice'
      },
      {
        title: '折后价',
        dataIndex: 'price'
      },
      {
        title: '库存',
        dataIndex: 'stock'
      },
      {
        title: '销量'
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
    const pagination = {
      current: mall.page + 1,
      pageSize: mall.limit,
      total: mall.count
    };
    const data = { list, pagination };
    return (
      <PageHeaderLayout title="商品管理">
        <Card bordered={false}>
          <div>
            <div style={{marginBottom: '10px'}}>
              <Button icon="plus" type="primary">添加商品</Button>
              {
                selectedRows.length > 0 && (
                  <span style={{marginLeft: '10px'}}>
                    <Button>删除</Button>
                  </span>
                )
              }
            </div>
            <GoodsManageTable
              loading={loading}
              selectedRows={selectedRows}
              columns={columns}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default GoodsManage;
