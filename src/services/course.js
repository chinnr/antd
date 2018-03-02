import graphRequest from "../utils/graphRequest";

// 获取课程模板列表
export function getCourseTempList(query) {
  const courseTemplateList = `query courseTemplateList($query:FormQuery!){
    me {
      courseTemplateList(query: $query) {
        data{
          id
          title
          score
          type
          stage
        }
        meta {
          page
          count
          limit
        }
      }
    }
  }`;
  return graphRequest(courseTemplateList, {query}, 'course-admin')
}
