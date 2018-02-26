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
    name: '团队管理',
    icon: 'team',
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
    icon: 'book',
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
    icon: 'idcard',
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
    icon: 'trophy',
    path: 'badge',
    children: [
      {
        name: '新建证章',
        path: 'new'
      },
      {
        name: '证章列表',
        path: 'list'
      },
      {
        name: '证章学员管理',
        path: 'badge-student'
      }
    ]
  },
  {
    name: '商城管理',
    icon: 'shop',
    path: 'mall',
    children: []
  },
  {
    name: '内容管理',
    icon: 'file',
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
      },
      {
        name: '编辑文章',
        path: 'edit',
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
