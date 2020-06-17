# vscode-generate-react-extension README


## [GZ] Generate File React
> 动态创建React模版

- 输入 index  会根据父文件夹名生成项目
- 输入 -_.等字符  会动态转成 驼峰命名

输出结构:

```ts
import React from 'react';

const Home = () => {
  return (
    <div className="Home">
      This is  Home
    </div>
  );
}
export default Home

```
