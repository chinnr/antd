import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class GoodsManageTable extends PureComponent {
  state = {
    selectedRowKeys: []
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading, columns,onShowSizeChange } = this.props;
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      onShowSizeChange:(c,s)=>onShowSizeChange(c,s),
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => Math.random(0,990) + record.sku}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}

        />
      </div>
    );
  }
}

export default GoodsManageTable;
