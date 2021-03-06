import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
import MallAdvertising from "../routes/Mall/MallAdvertising";
import OrderList from "../routes/Mall/OrderList";

let routerDataCache;

const modelNotExisted = (app, model) => {
  // eslint-disable-next-line
  return !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
};

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    // '/dashboard/analysis': {
    //   component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    // },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/course/new': {
      component: dynamicWrapper(app, ['course', 'badge'], () => import('../routes/Course/NewCourse')),
    },
    '/course/edit': {
      component: dynamicWrapper(app, ['course', 'badge'], () => import('../routes/Course/CourseEdit')),
    },
    '/course/template-list': {
      component: dynamicWrapper(app, ['course'], () => import('../routes/Course/CourseTemplateList')),
    },
    '/course/course-record': {
      component: dynamicWrapper(app, ['course'], () => import('../routes/Course/CourseRecord')),
    },
    '/course/course-review': {
      component: dynamicWrapper(app, ['course','student'], () => import('../routes/Course/CourseReview')),
    },
    '/course/course-detail': {
      component: dynamicWrapper(app, ['course','student'], () => import('../routes/Course/CourseDetail')),
    },
    '/student': {
      component: dynamicWrapper(app, ['student'], () => import('../routes/Student/StudentManage'))
    },
    '/student-detail/:id': {
      component: dynamicWrapper(app, ['student', 'mall'], () => import('../routes/Student/StudentDetail'))
    },
    '/team/new': {
      component: dynamicWrapper(app, ['team'], () => import('../routes/Team/NewTeam')),
    },
    '/team/list': {
      component: dynamicWrapper(app, ['team', 'student'], () => import('../routes/Team/TeamList')),
    },
    '/team/edit-info': {
      component: dynamicWrapper(app, ['team'], () => import('../routes/Team/UpdateTeamInfo')),
    },
    '/team/point-coach': {
      component: dynamicWrapper(app, ['team','student'], () => import('../routes/Team/pointCoach')),
    },
    '/team/edit-account': {
      component: dynamicWrapper(app, ['team'], () => import('../routes/Team/UpdateTeamAccount')),
    },
    '/mall/goods-type': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/GoodsType')),
    },
    '/mall/goods-list': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/GoodsManage')),
    },
    '/mall/advertising': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/MallAdvertising')),
    },
    '/mall/order-list': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/OrderList')),
    },
    '/mall/order-detail/:id': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/OrderDetail')),
    },
    '/mall/order-send/:id': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/OrderSendOut')),
    },
    '/mall/goods-add': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/GoodsAdd')),
    },
    '/mall/goods-edit': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/GoodsEdit')),
    },
    '/mall/type-edit': {
      component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/GoodsTypeAdd')),
    },
    '/badge/new': {
      component: dynamicWrapper(app, ['badge'], () => import('../routes/Badge/NewBadge')),
    },
    '/badge/list': {
      component: dynamicWrapper(app, ['badge'], () => import('../routes/Badge/BadgeList')),
    },
    '/post/new': {
      component: dynamicWrapper(app, ['post'], () => import('../routes/Post/NewPost')),
    },
    '/post/classes': {
      component: dynamicWrapper(app, ['post'], () => import('../routes/Post/NewClasses')),
    },
    '/post/list': {
      component: dynamicWrapper(app, ['post'], () => import('../routes/Post/PostList')),
    },
    '/post/detail': {
      component: dynamicWrapper(app, ['post'], () => import('../routes/Post/PostDetail')),
    },
    '/post/edit': {
      component: dynamicWrapper(app, ['post'], () => import('../routes/Post/UpdatePost')),
    },
    '/Statistics/detail': {
      component: dynamicWrapper(app, ['statistics'], () => import('../routes/Statistics/Statistics')),
    }
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
