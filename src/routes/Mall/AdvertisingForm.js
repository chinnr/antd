import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class AdvertisingForm extends PureComponent {
  render() {
    const { data: { list, pagination }, loading, columns } = this.props;

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
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
