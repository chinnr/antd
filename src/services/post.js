import graphRequest from '../utils/graphRequest';

// 获取文章类型列表
export function getClasses(query) {
  const getClasses = `query classes($query: QueryArgv!) {
  public{
    classes(query: $query) {
      data{
        id
        name
      }
      meta{
        limit
        page
        count
      }
    }
  }
}`;
  return graphRequest(getClasses, {query}, 'post')
}

// 创建新文章
export function createPost(argv) {
  const createPost = `mutation createPost($argv: CreatePostArgv!) {
    me {
      createPost(argv: $argv) {
        title
        content
        cid
        id
      }
    }
  }`;
  return graphRequest(createPost, {argv}, 'post')
}
