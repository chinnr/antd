import { Modal, Form, Pagination, Checkbox } from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const CoachForm = Form.create()(props => {
  const {
    visible,
    onCancel,
    addCoach,
    form,
    coach,
    page,
    count,
    onPagination
  } = props;
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
          {getFieldDecorator('uids', {
            rules: [{ required: true, message: '请指定教官!' }]
          })(
            <CheckboxGroup>
              {coach.map(item => (
                <Checkbox key={item.uid} value={item.uid}>
                  {item.base.profile.realName}
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}
          <div style={{ marginTop: 20 }}>
            <Pagination
              defaultCurrent={1}
              hideOnSinglePage={true}
              total={count}
              onChange={p => onPagination(p)}
            />
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
});

export default CoachForm;
