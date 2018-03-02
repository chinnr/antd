import { Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

const PswForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="修改团密码"
        okText="提交"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="新的密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入新密码!' }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export default PswForm;
