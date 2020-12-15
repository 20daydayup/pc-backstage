export { default as login } from "./acl/login"; // {default: {}}
export { default as user } from "./acl/user";
export { default as role } from "./acl/role";
export { default as permission } from "./acl/permission";
export { default as category } from "./category";
export { default as clientUser } from "./clientUser";
export { default as order } from "./order";
// 1. 引入默认暴露的内容重命名为order
// 2. 将order给分别暴露出去
export { default as trademark } from "./product/trademark";
export { default as attrs } from "./product/attrs";
export { default as spu } from "./product/spu";
