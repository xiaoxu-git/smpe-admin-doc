## 开发准备

### 所需环境
1.JDK 1.8+

2.MySQL 5.5.0+

3.Redis 3.0+

4.Maven 3.0+

5.Node v10+

6.Vue-cli 3.0+


### 在使用该系统前，你还需要做如下准备

1. 给 [idea (opens new window)](https://blog.csdn.net/wochunyang/article/details/81736354)或者 [eclipse (opens new window)](https://blog.csdn.net/magi1201/article/details/85995987)安装 lombok 插件，我们用它可以省略get，set 方法，可以使代码更简洁， 具体查看[ lombok教程(opens new window)](https://www.cnblogs.com/guodong-wang/p/8333888.html)
2. 了解MapStruct，项目用到了它的映射实体，如果你不熟悉可以查看：[熟悉MapStruct(opens new window)](https://www.jianshu.com/p/3f20ca1a93b0)
3. 你需要有 Spring boot 的基础，推荐教程 [Spring Boot 2.0 学习(opens new window)](https://github.com/ityouknow/spring-boot-examples)
4. 你需要有 [Vue (opens new window)](https://cn.vuejs.org/v2/guide/)的基础，推荐入门视屏教程 [网易云课堂](https://study.163.com/course/courseMain.htm?courseId=1004711010)
5. 熟悉git使用流程，推荐博客[带你了解实际工作中git的使用流程](https://blog.csdn.net/weixin_42822484/article/details/107093262)
6. 从GitHub上拉取前后端项目以及数据库[GitHub地址](https://github.com/shiwei-Ren/smpe-admin)
7. 本地安装Redis，推荐教程 [Redis Windows 64位下安装Redis详细教程](https://blog.csdn.net/weixin_37264997/article/details/80062765?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.control)

## 运行项目

### **后端安装及启动**

####  1.用git克隆后端项目到本地

后端git地址：`https://github.com/sanyueruanjian/smpe-admin`

<img :src="$withBase('/img/image1.png')" alt="foo">

#### 2. 用编译器导入项目

#### 3.执行sql文件

目的：快速生成项目的Mysql库表

​	a. 在数据库中新建数据库：smpe

<img :src="$withBase('/img/image09.png')" alt="foo">

​	b.右键smpe数据库，点击运行SQL文件然后选择执行项目文件目录中sql文件夹下的.sql文件

<img :src="$withBase('/img/image3.png')" alt="foo">


#### 4.修改项目配置文件

​	a.找到开发环境的配置文件

<img :src="$withBase('/img/image5.png')" alt="foo">

​	b.修改配置

<img :src="$withBase('/img/image6.png')" alt="foo">

#### 5.启动Redis服务

```yml
  redis:
    #数据库索引
    database: 7
    host: 127.0.0.1
    port: 6379
    password:
    #连接超时时间（ms）
    timeout: 5000
    # 自定义redis默认过期时间（单位：时）
    expire-time: 24
    jedis:
      pool:
        # 连接池最大连接数（使用负值表示没有限制）
        max-active: -1
        # 连接池最大阻塞等待时间（使用负值表示没有限制）
        max-wait: -1

  servlet:
    multipart:
      # 开启 multipart 上传功能
      enabled: true
      # 文件写入磁盘的阈值
      file-size-threshold: 2KB
      # 最大文件大小
      max-file-size: 200MB
      # 最大请求大小
      max-request-size: 215MB

```
#### 6.启动项目

<img :src="$withBase('/img/image8.png')" alt="foo">

​		出现`Started AppRun in 6.047 seconds (JVM running for 6.869)`，代表启动成功

<img :src="$withBase('/img/image9.png')" alt="foo">



### **前端安装及启动**

#### **1. 用git克隆前端项目到本地**

前端git地址：`https://github.com/sanyueruanjian/smpe-admin-web`

<img :src="$withBase('/img/image10.png')" alt="foo">

#### **2. 安装项目依赖**

1. 用编译器导入项目

2. 安装依赖

   2.1. 建议使用`npm`安装依赖，使用`cnpm`安装会 出现奇怪的问题，可以用`registry`指向淘宝镜像解决`npm`下载速度慢

<img :src="$withBase('/img/image11.png')" alt="foo">

#### 3. 安装依赖完成后，启动前端项目：`npm run dev` 

<img :src="$withBase('/img/image12.png')" alt="foo">

#### 4.打开浏览器，输入：`(http://localhost:8013)`

```xml
 账号密码：admin/123456 
```

#### **5. 若能正确展示登录页面，并能成功登录，且菜单及页面展示正常，则表明前后端启动成功**

<img :src="$withBase('/img/image13.png')" alt="foo">

<img :src="$withBase('/img/image14.png')" alt="foo">

