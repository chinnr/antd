import graphRequest from '../utils/graphRequest';

// 创建课程模板
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

// 编辑课程模板
export function updateCourseTemplate(argv) {
  const mutation = `mutation updateCourseTemplate($argv: UpdateCourseTemplateArgv!) {
    me{
      updateCourseTemplate(argv: $argv) {
        title
      }
    }
  }`;
  return graphRequest(mutation, { argv }, 'course-admin');
}

// 删除课程模版
export function deleteCourseTemplate(id) {
  const deleteCourseTemplate = `mutation deleteCourseTemplate($id: String!) {
    me {
      deleteCourseTemplate(id: $id)
    }
  }`;
  return graphRequest(deleteCourseTemplate, id, 'course-admin');
}

// 获取课程模板列表
export function courseTemplatePubList(payload) {
  const courseTemplatePubList = `query courseTemplatePubList($tempQuery:FormQuery){
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
        brief {
          picture
          title
          text
        }
        badgeList{
          bid
          name
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

export function courseTemplateByGroupName(payload) {
  const courseTemplatePubList = `query courseListByGroupName($tempQuery:FormQuery,$groupName: String!){
    me {
      courseListByGroupName(query: $tempQuery,groupName:$groupName) {
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
        badgeList{
          bid
          name
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

export function courseTemplateByCity(payload) {
  const courseTemplatePubList = `query courseListByCity($tempQuery:FormQuery,$city: String!){
    me {
      courseListByGroupCity(query: $tempQuery,city:$city) {
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
        badgeList{
          bid
          name
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
          createdAt
          group {
            name
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
  return graphRequest(courseList, { query }, 'course-admin');
}

// 获取开课的课程详情
export function courseDetail(id) {
  const query = `query courseDetail($id: String!) {
    me{
      course(id: $id) {
        id
        oid
        group{
          name
        }
        title
        skills
        score
        state
        type
        method
        note
        gallery
        badgeList{
          name
          bid
        }
        brief{
          picture
          title
          text
        }
        stage
        groupCoaches
        level
        cover
        content
        lesson
        capacity
        deadlinedAt
        payExpCoupons
        payClassCoupons
        startedAt
        endedAt
        instructors
        courseLocation
        collectLocation
        description
      }
    }
  }`;
  return graphRequest(query, id, 'course-admin');
}

// 审核通过
export function resolveCourse(argv) {
  console.log("resolveCourse service ==>", argv);
  const mutation = `mutation resolveCourse($argv: AdminResolveCourseArgv!) {
    me {
      resolveCourse(argv: $argv) {
        title
      }
    }
  }`;
  return graphRequest(mutation, argv, 'course-admin');
}

// 审核不通过
export function rejectCourse(argv) {
  const mutation = `mutation rejectCourse($argv: AdminRejectCourseArgv!) {
    me {
      rejectCourse(argv: $argv) {
        title
      }
    }
  }`;
  return graphRequest(mutation, argv, 'course-admin');
}
