import graphRequest from '../utils/graphRequest';

// 创建课程
export function createCourseTemplate(argv) {
  const mutation = `mutation createCourseTemplate($argv: CreateCourseTemplateArgv!) {
    me{
      createCourseTemplate(argv: $argv) {
        title
      }
    }
  }`;
  return graphRequest(mutation, { argv }, 'course-admin');
}

// 获取课程模板列表
export function courseTemplatePubList(payload) {
  const courseTemplatePubList = `query courseTemplatePubList($tempQuery:FormQuery, $badgeQuery:FormQuery!){
    me {
      courseTemplatePubList(query: $tempQuery) {
        data{
        id
        oid
        title
        description
        content
        skills
        score
        type
        stage
        level
        lesson
        payExpCoupons
        payClassCoupons
        instructors
        state
        cover
        gallery
        note
        createdAt
        badge(query: $badgeQuery){
          data{
            id
            name
          }
          meta{
            limit
            count
            page
          }
        }
      }
      meta {
        limit
        count
        page
      }
      }
    }
  }`;
  return graphRequest(courseTemplatePubList, payload, 'course-admin');
}

// 开课记录
export function courseList(query) {
  const courseList = `query courseList($query: FormQuery!) {
    me{
      courseList(query: $query) {
        data {
          id
          title
          skills
          type
          method
          state
          status
          createdAt
        }
        meta {
          limit
          count
          page
        }
      }
    }
  }`;
  return graphRequest(courseList, {query}, 'course-admin')
}
