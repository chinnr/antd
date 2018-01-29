import React, { PureComponent } from 'react';
import { Card, Form, Table, Input, Popconfirm, Divider, Button, Icon, Modal, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const data = [];
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `团集会 ${i}`,
    theme: `团集会课程主题 {i}`,
    createdAt: '2017-60-08',
    address: `London Park no. ${i}`,
  });
}

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class TeamTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data,
      visible: false
    };
    this.columns = [
      {
        title: '课程名称',
        dataIndex: 'name',
        width: '20%',
        render: (text, record) => this.renderColumns(text, record, 'name'),
      },
      {
        title: '课程主题',
        dataIndex: 'theme',
        width: '20%',
        render: (text, record) => this.renderColumns(text, record, 'theme'),
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '20%',
        render: (text, record) => this.renderColumns(text, record, 'createdAt'),
      },
      {
        title: '课程环节',
        dataIndex: 'courseLink',
        width: '20%',
        render: (text, record) => this.renderColumns(text, record, 'courseLink'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editable } = record;
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                    <a onClick={() => this.save(record.key)}>保存</a>
                    <Popconfirm title="是否取消编辑?" onConfirm={() => this.cancel(record.key)}>
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                  :
                  <div>
                    <a onClick={() => this.edit(record.key)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.edit(record.key)}>删除</a>
                  </div>
              }
            </div>
          );
        },
      }
    ];
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }

  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }

  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }

  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  /**
   * 显示弹窗
   */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 确认添加
   * @param e
   */
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  /**
   * 关闭弹窗
   * @param e
   */
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSelectChange(value) {
    console.log(`selected ${value}`);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout title={null} content={null}>
        <Card bordered={false}>
          <span>请选择模板列表  </span>
          <Select defaultValue="海狸课程" style={{ width: 120, marginRight: 20 }} onChange={()=>this.handleSelectChange()}>
            <Option value="海狸课程">海狸课程</Option>
            <Option value="小狼课程">小狼课程</Option>
            <Option value="乐扶课程">乐扶课程</Option>
          </Select>
          <Search
            placeholder="搜索"
            onSearch={value => console.log(value)}
            style={{ width: 200, marginBottom: 20, marginRight: 20 }}
          />
          <Button type="primary" onClick={() => this.showModal()}>
            添加
            <Icon type="plus" />
          </Button>
          <Table bordered dataSource={this.state.data} columns={this.columns} />
        </Card>
        {/*添加课程课程的弹窗*/}
        <Modal
          title="新增课程课程"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '课程名称不能够为空!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="课程名称" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}

export default Form.create()(TeamTemplate);
