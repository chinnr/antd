import graphRequest from "../utils/graphRequest";

// 创建课程
export function createCourseTemplate(argv) {
  const mutation = `mutation createCourseTemplate($argv: CreateCourseTemplateArgv!) {
    me{
      createCourseTemplate(argv: $argv) {
        title
      }
    }
  }`;
  return graphRequest(mutation, {argv}, 'course-admin')
}


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
