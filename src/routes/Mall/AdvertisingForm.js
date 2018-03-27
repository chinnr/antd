import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class AdvertisingForm extends PureComponent {
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

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading, columns } = this.props;

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.tid}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default AdvertisingForm;
