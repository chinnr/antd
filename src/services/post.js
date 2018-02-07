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

// 获取文章列表
export function postList(query) {
  const postList = `query posts($query: QueryArgv!) {
    public{
      posts(query: $query){
        data{
          title
          content
          gallery
          id
          createdAt
        }
        meta {
          limit
          page
          count
        }
      }
    }
  }`;
  return graphRequest(postList, query, 'post')
}

//获取文章详情
export function postDetail(id) {
  console.log("获取文章详情 id", id)
  const postDetail = `query postDetail($id: ID) {
    public {
      post(id: $id) {
        content
        createdAt
        title
      }
    }
  }`;
  return graphRequest(postDetail, id, 'post')
}

// 更新某一篇文章
export function updatePost(argv) {
  const updatePost = `mutation deletePost($argv: UpdatePostArgv!) {
    me {
      updatePost(argv: $argv) {
        title
        content
        createdAt
      }
    }
  }`;
  return graphRequest(updatePost, {argv}, 'post')
}

