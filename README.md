# package-file-server

### 接口文档

baseUrl：http://localhost:3000/api

\- POST  */relativePath* 上传文件/文件夹的目录

\- POST  */package* 通过jszip打包生成zip

\- POST  */newpackage* 通过compressing打包生成zip/tar/tgz，暂不支持gzip

\- GET  */download* 下载

### 一、上传文件/文件夹的目录✅

请求地址：**POST** `/api/relativePath`

#### 参数

| 参数名 | 类型   | 必填 | 说明     |
| ------ | ------ | ---- | -------- |
| 无     | object | 是   | 目录格式 |

#### 返回结果

| 参数名    | 类型   | 必填 | 说明                            |
| --------- | ------ | ---- | ------------------------------- |
| timestamp | number | 是   | 时间戳，是后台生成的zip的文件id |

#### 使用示例

```javascript
// 上传文件/文件夹的目录 - /api/relativePath
input = {
  {
    type: 'zip',//tar/tgz,格式必须是这样，否则无法打包
    file0: "src/App.vue"
    file1: "src/main.js"
    file2: "src/assets/logo.png"
    file3: "src/api/index.js"
  }
};
output = {
  ok: true
  result: {
    timestamp: 1594720945125
  },
};
```

### 二、生成zip✅

请求地址：**POST** `/api/package`

#### 参数：

无参数

### 返回结果

| 参数名   | 类型   | 必填 | 说明               |
| -------- | ------ | ---- | ------------------ |
| filename | string | 是   | 后台生成的目录名称 |

### 三、打包生成zip/tar/tgz✅

请求地址：**POST** `/api/newpackage`

#### 参数：

无参数

### 返回结果

| 参数名   | 类型   | 必填 | 说明               |
| -------- | ------ | ---- | ------------------ |
| filename | string | 是   | 后台生成的目录名称 |
|          | string | 是   | 打包的文件后缀     |

### 四、下载✅

请求地址：**GET** `/api/download`

#### 参数：

| 参数名   | 类型   | 必填 | 说明                           |
| -------- | ------ | ---- | ------------------------------ |
| filename | string | 是   | /api/package接口返回的目录名称 |

