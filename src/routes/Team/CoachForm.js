import { Modal, Form, Pagination, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const CoachForm = Form.create()(
  (props) => {
    const { visible, onCancel, addCoach, form, coach, page, count, onPagination } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="指派教官"
        okText="提交"
        onCancel={onCancel}
        onOk={addCoach}
      >
        <Form layout="vertical">
          <FormItem label="教官列表">
            {getFieldDecorator('uid', {
              rules: [{ required: true, message: '请指定教官!' }],
            })(
              <RadioGroup>
                {coach.map( item => (
                  <Radio key={item.uid} value={item.uid}>{item.base.username}</Radio>
                ))}
              </RadioGroup>
            )}
            <div style={{marginTop: 20}}>
              <Pagination
                defaultCurrent={1}
                hideOnSinglePage={true}
                total={count}
                onChange={(p) => onPagination(p)}
              />
            </div>
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export default CoachForm;
