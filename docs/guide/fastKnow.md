
## **主要特性**

- 使用最新技术栈，社区资源丰富。
- 支持接口限流，避免恶意请求导致服务层压力过大
- 支持接口级别的功能权限与数据权限，可自定义操作
- 自定义权限注解与匿名接口注解，可快速对接口拦截与放行
- 前后端统一异常拦截处理，统一输出异常，避免繁琐的判断
- 自定义扩展Mybatis-Plus的功能                 
- 高效率开发，代码生成器可一键生成前后端代码                      
- 完善的日志记录体系简单注解即可实现                                                                                        

##   **系统功能**

### **系统管理**

- 用户管理：提供用户的相关配置，新增用户后，默认密码为123456
- 角色管理：对权限与菜单进行分配，可根据部门设置角色的数据权限
- 菜单管理：已实现菜单动态路由，后端可配置化，支持多级菜单
- 部门管理：可配置系统组织架构，树形表格展示
- 岗位管理：配置各个部门的职位
- 任务调度：管理定时任务
- 字典管理：待开发

### **系统监控**

- 在线用户：记录登陆系统的用户
- 操作日志：记录用户的操作情况
- 异常日志：记录用户的异常操作情况

## **项目技术**

###   **前端技术**

**Axios**：[Axios](http://axios-js.com/)

**Vue**:[Vue](https://vuejs.bootcss.com/guide/)

Element-ui:[Element-ui](https://element.eleme.cn/#/zh-CN)

### **后端技术**

**Spring** Security:[Spring Security](https://spring.io/projects/spring-security)

**Mybatis**-Plus :[Mybatis-Plus](https://baomidou.com/)

**Redis**:[Redis](http://www.redis.cn/)

**HuTool**：[HuTool官方文档](https://hutool.cn/docs/#/)。

### **其他**

**swagger**：[swagger官网](https://swagger.io/)

**nginx**：[nginx中文文档](https://www.nginx.cn/doc/)

**docker**：[docker官方文档](https://docs.docker.com/)

## **项目结构**

### **后端项目结构**

```xml
- smpe-common 公共模块
    - annotation 为系统自定义注解
    - aspect 自定义注解的切面
    - base 提供了常用基类
    - bean 读取yml中的通用配置类
    - config 全局配置文件，例如swagger、MyBatis-Plus、redis、跨域处理等的配置
        - thread 线程池相关
    - enums 全局枚举类
    - exception 项目统一异常的处理
    - response 统一返回前端数据封装
    - utils 系统通用工具类
- smpe-log 日志模块
    - annotation 日志自定义注解
    - aspect 自定义日志切面
    - controller 日志控制层
    - entity 日志实体
    - enums 日志常用枚举
    - mapper 日志接口
    - service 日志服务
- smpe-system 系统核心模块（系统启动入口）
    - config 核心模块配置（非全局配置）
    - modules 系统相关模块(登录授权、用户部门管理等、自定义业务)
        - business 业务模块（一般项目业务开发模块可放在此包下，各模块可构建自己的config、utils、enums等）
        - generator mpbatisplus的代码生成（后端）
        - security 安全认证（SpringSecurity+JWT）
        - system 系统核心模块（用户、角色、部门、岗位、菜单管理等）（各模块文件夹结构可参考如下）
            - controller
            - entity
                - bo
                - dto
            - mapper
            - service
                - impl
                - mapstruct(Java实体映射文件)
            - config（仅限本模块使用的配置文件，没有可忽略）
            - utils（仅限本模块使用的工具类，没有可忽略）
        - upload 文件模块（上传、下载等）
    - utils 核心模块工具类（仅限smpe-system子工程使用的工具类，非全局使用）
- smpe-xxx （自定义待开发模块）
- sql 数据库文件
- Dockerfile 构建后端服务器环境的Dockerfile（基于docker）
- smpe-admin.sh 后端部署脚本
- smpe-admin.conf nginx配置文件
```

###    **前端项目结构**

```xml
|-- public         存放静态资源，存放在该文件夹的东西不会被打包影响，而是会原封不动的输出到dist文件夹中
    |-- favicon.ico   网站图标
    |-- index.html     主页，项目入口
|-- :src
    |-- api        后端请求接口文件
    |- assets        静态资源
    |-- components    公用组件
    |-- layout      系统布局：头部、侧边栏、设置、中间内容页面
    |-- mixins      混入文件
    |-- router      路由配置
    |-- store        vuex存放数据
    |-- utils        工具包
    |-- views        页面
    |-- app.vue      根组件
|-- main.js        入口文件
|-- settings.js      全局配置文件，存储一些键和值，供全局调用
|-- .gitignore      git忽略上传的文件格式
|-- .env.development    开发环境下的接口地址配置
|-- .env.production   生产环境下的接口地址配置
|-- .eslintignore      不用校验的文件
|-- .eslintrc.js      ES-lint校验(编码规范、校验规则)
|-- vue.config.js      cli配置文件
```
