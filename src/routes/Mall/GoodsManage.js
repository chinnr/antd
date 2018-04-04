import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Input, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import GoodsManageTable from './GoodsManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { successNotification } from '../../utils/utils';

@connect(({ mall, loading }) => ({
  mall,
  loading: loading.models.mall
}))
class GoodsManage extends PureComponent {
  columns = [
    {
      title: '商品名称',
      key: 'goodsName',
      render: record => (
        <div>
          <p>{record.name}</p>
          <p>sku: {record.sku}</p>
        </div>
      )
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
      title: '销量',
      dataIndex: 'hasSold'
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a onClick={() => this.editGoods(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteGoods(record)}>删除</a>
        </Fragment>
      )
    }
  ];
  state = {
    selectedRows: []
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };

  handleTableChange = n => {
    console.log('n is ', n);
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/getGoodsList',
      payload: {
        query: {
          page: n.current - 1,
          limit: 10,
          sort: ['-createdAt']
        }
      }
    });
  };

  editGoods = record =>{
    this.props.dispatch(
      routerRedux.push({
        pathname: '/mall/goods-edit',
        query: {
          record: record
        }
      })
    )
  }

  deleteGoods = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mall/deleteGoods',
      payload: {
        gid: record.gid
      }
    })
      .then(() => {
        const { mall } = this.props;
        successNotification('操作成功', function() {
          dispatch({
            type: 'mall/getGoodsList',
            payload: {
              page: mall.goodsListMeta.page,
              limit: 10,
              sort: ['-createdAt']
            }
          });
        });
      })
      .catch(err => err);
  };

  render() {
    const { mall, loading } = this.props;
    // console.log("goodsList==>", mall)
    const { selectedRows } = this.state;
    const list = mall.goodsList;
    const pagination = {
      current: mall.goodsListMeta.page + 1,
      pageSize: mall.goodsListMeta.limit,
      total: mall.goodsListMeta.count
    };
    const data = { list, pagination };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <GoodsManageTable
            loading={loading}
            selectedRows={selectedRows}
            columns={this.columns}
            data={data}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodsManage;
