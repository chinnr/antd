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
        name: '团信息修改',
        path: 'edit-info',
        hideInMenu: true,
      },
      {
        name: '团账号修改',
        path: 'edit-account',
        hideInMenu: true,
      },
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
        name: '新建课程模版',
        path: 'new',
      },
      {
        name: '课程模版列表',
        path: 'template-list',
      },
      {
        name: '开课列表',
        path: 'course-record',
      },
      {
        name: '课程审核',
        path: 'course-review',
        hideInMenu: true,
      }
    ],
  },
  {
    name: '学员管理',
    icon: 'idcard',
    path: 'student-manage'
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
      }
    ]
  },
  {
    name: '商城管理',
    icon: 'shop',
    path: 'mall',
    children: [
      {
        name: '商品类型管理',
        path: 'goods-type'
      },
      {
        name: '商品管理',
        path: 'goods-list'
      },
      {
        name: '广告位',
        path: 'ad'
      },
      {
        name: '订单管理',
        path: 'order'
      }
    ]
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
