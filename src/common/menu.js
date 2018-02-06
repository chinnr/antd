import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [{
      name: '分析页',
      path: 'analysis',
    }, {
      name: '监控页',
      path: 'monitor',
    }, {
      name: '工作台',
      path: 'workplace',
      // hideInMenu: true,
    }],
  },
  {
    name: '参考demo',
    icon: 'dashboard',
    path: '/',
    children: [
      {
        name: '表单页',
        icon: 'form',
        path: 'form',
        children: [{
          name: '基础表单',
          path: 'basic-form',
        }, {
          name: '分步表单',
          path: 'step-form',
        }, {
          name: '高级表单',
          authority: 'admin',
          path: 'advanced-form',
        }],
      }, {
        name: '列表页',
        icon: 'table',
        path: 'list',
        children: [{
          name: '查询表格',
          path: 'table-list',
        }, {
          name: '标准列表',
          path: 'basic-list',
        }, {
          name: '卡片列表',
          path: 'card-list',
        }, {
          name: '搜索列表',
          path: 'search',
          children: [{
            name: '搜索列表（文章）',
            path: 'articles',
          }, {
            name: '搜索列表（项目）',
            path: 'projects',
          }, {
            name: '搜索列表（应用）',
            path: 'applications',
          }],
        }],
      }, {
        name: '详情页',
        icon: 'profile',
        path: 'profile',
        children: [{
          name: '基础详情页',
          path: 'basic',
        }, {
          name: '高级详情页',
          path: 'advanced',
          authority: 'admin',
        }],
      }, {
        name: '结果页',
        icon: 'check-circle-o',
        path: 'result',
        children: [{
          name: '成功',
          path: 'success',
        }, {
          name: '失败',
          path: 'fail',
        }],
      }, {
        name: '异常页',
        icon: 'warning',
        path: 'exception',
        children: [{
          name: '403',
          path: '403',
        }, {
          name: '404',
          path: '404',
        }, {
          name: '500',
          path: '500',
        }, {
          name: '触发异常',
          path: 'trigger',
          hideInMenu: true,
        }],
      }, {
        name: '账户',
        icon: 'user',
        path: 'user',
        authority: 'guest',
        children: [{
          name: '登录',
          path: 'login',
        }, {
          name: '注册',
          path: 'register',
        }, {
          name: '注册结果',
          path: 'register-result',
        }],
      }, {
        name: '使用文档',
        icon: 'book',
        path: 'http://pro.ant.design/docs/getting-started',
        target: '_blank',
      }
    ],
  },
  {
    name: '团队管理',
    icon: 'dashboard',
    path: 'team',
    children: [
      {
        name: '新建团队',
        path: 'new',
      },
      {
        name: '团队列表',
        path: 'list',
      }
     ]
  },
  {
    name: '课程管理',
    icon: 'dashboard',
    path: 'course',
    children: [
      {
        name: '课程类型管理',
        path: 'type',
      },
      {
        name: '课程标签管理',
        path: 'tag',
      },
      {
        name: '团集会模板管理',
        path: 'team-template',
        // hideInMenu: true,
      },
      {
        name: '新建模板',
        path: 'create-template',
        hideInMenu: true,
      },
      {
        name: '兴趣课模板管理',
        path: 'interest-template'
      },
      {
        name: '活动课管理',
        path: 'activity'
      },
      {
        name: '开课记录',
        path: 'records'
      }
    ],
  },
  {
    name: '学员管理',
    icon: 'dashboard',
    path: 'student',
    children: [
      {
        name: '学员级别管理',
        path: 'level-manage'
      },
      {
        name: '学员信息管理',
        path: 'info-manage'
      }
    ]
  },
  {
    name: '证章管理',
    icon: 'dashboard',
    path: 'badge',
    children: [
      {
        name: '证章类型管理',
        path: 'badge-type'
      },
      {
        name: '证章模型管理',
        path: 'badge-model'
      },
      {
        name: '证章学员管理',
        path: 'badge-student'
      }
    ]
  },
  {
    name: '商城管理',
    icon: 'dashboard',
    path: 'mall',
    children: []
  },
  {
    name: '内容管理',
    icon: 'dashboard',
    path: 'post',
    children: [
      {
        name: '新建文章',
        path: 'new'
      },
      {
        name: '文章列表',
        path: 'list'
      },
      {
        name: '文章详情',
        path: 'detail',
        hideInMenu: true,
      }
    ]
  }
  ];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
