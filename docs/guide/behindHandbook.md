## 权限控制

本系统权限控制采用 `RBAC`思想。简单地说，一个用户拥有若干角色，每一个角色拥有若干个菜单，菜单中存在菜单权限与按钮权限， 这样，就构造成“用户-角色-菜单” 的授权模型。在这种模型中，用户与角色、角色与菜单之间构成了多对多的关系，如下图

<img :src="$withBase('/img/image17.png')" alt="foo">

本系统安全框架使用的是 `Spring Security + Jwt Token`， 访问后端接口需在请求头中携带 `token`进行访问

### **数据交互**

用户登录 -> 后端验证登录返回 `token`-> 前端带上`token`请求后端数据 -> 后端返回数据， 数据交互流程如下：

<img :src="$withBase('/img/image18.png')" alt="foo">



### **权限方法及注解**

在SpringSecurity安全框架中，提供了一些方法和注解来帮助我们进行权限判断和数据过滤

| **表达式**                             | **描述**                                                     |
| -------------------------------------- | ------------------------------------------------------------ |
| hasRole(String role)                   | 当前用户是否拥有指定角色。如果用户具备给定角色就则返回true，否则出现403 |
| hasAnyRole(String... roles)            | 多个角色是一个以逗号进行分隔的字符串。如果当前用户拥有指定角色中的任意一个则返回true。 |
| hasAuthority(String authority)         | 如果当前的主体具有指定的权限，则返回 true,否则返回 false  。适用于单个角色，不适用于多个角色权限 |
| hasAnyAuthority(String... authorities) | 如果当前的主体有任何提供的角色（给定的作为一个逗号分隔的字符串列表）的话，返回 true。适用于多个角色权限 |
| @Secured                               | 判断是否具有角色，另外需要注意这里匹配的字符串需要加前缀"ROLE_" |
| @PreAuthorize                          | 注解适合进入方法前的权限验证，可以将登录用户的roles/permissions参数传到方法中。方法执行之前校验 |
| @PostAuthorize                         | 使用并不多，在方法执行后再进行权限验证，适合验证带有返回值的权限 |
| @PostFilter                            | 对返回的数据进行过滤                                         |
| @PreFilter                             | 对传入的数据进行过滤                                         |

下面的接口表示用户拥有user:del权限就能能访问delete方法， 如果方法不加@preAuthorize注解，意味着所有用户都需要带上有效的token 后才能访问delete 

```java
 @ApiOperation("删除用户")
    @DeleteMapping
    @PreAuthorize("@smpe.check('user:del')")
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> delete(@RequestBody Set<Long> ids) {
        for (Long id : ids) {
            if (!checkLevel(id)) {
                log.error("【删除用户失败】角色权限不足，不能删除。" + "操作人id：" + SecurityUtils.getCurrentUserId() + "。预删除用户id：" + id);
                throw new BadRequestException("角色权限不足，不能删除：" + userService.getById(id).getUsername());
            }
        }
        boolean isDel = userService.removeByIds(ids);
        if (! isDel) {
            log.error("【删除用户失败】角色权限不足，不能删除。" + "操作人id：" + SecurityUtils.getCurrentUserId() + "。预删除用户id集合：" + ids);
            throw new BadRequestException("【删除用户失败】" + "操作人id：" + SecurityUtils.getCurrentUserId());
        }
        return Result.success();
    }
```

**check()** 方法表示如果该身份是admin的话，直接返回true，不再进行多余判断。如果不是admin的话，将用户的所有身份进行判断，看是否有匹配的身份，若有返会true，无则返回false

```java
@Service(value="smpe")
publicclassPermissionConfig {
publicBooleancheck(String... permissions) {
// 获取当前用户的所有权限
List<String>smpePermissions=
SecurityUtils.getCurrentUser().getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
// 判断当前用户的所有权限是否包含接口上定义的权限
returnsmpePermissions.contains("admin") ||Arrays.stream(permissions).anyMatch(smpePermissions::contains);
    }
}
```

使用方式：

```java
@PreAuthorize("@smpe.check('user:del')")
```



### **接口放行**

在我们使用的时候，有些接口是不需要验证权限的，这个时候就需要我们给接口放行，使用方式如下：

1、使用注解方式

只需要在Controller的方法上加入该注解即可

@AnonymousAccess2、修改配置文件方式

smpe-system -> modules -> security -> config -> SecurityConfig

使用 `permitAll()`方法所有人都能访问，包括带上 `token`访问使用 `anonymous()`所有人都能访问，但是带上 `token`访问后会报错

```java
// 关键代码，部分略
protectedvoidconfigure(HttpSecurityhttpSecurity) throwsException {
// 搜寻匿名标记 url： @AnonymousAccess
Map<RequestMappingInfo, HandlerMethod>handlerMethodMap=
applicationContext.getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
// 获取匿名标记
Map<String, Set<String>>anonymousUrls=getAnonymousUrl(handlerMethodMap);
log.info("放行的接口(匿名访问)"+anonymousUrls);
httpSecurity
// 自定义匿名访问所有url放行：允许匿名和带Token访问，细腻化到每个 Request 类型
        // 放行OPTIONS请求
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
// GET
                .antMatchers(HttpMethod.GET,
anonymousUrls.get(RequestMethodEnum.GET.getType()).toArray(newString[0])).permitAll()
// POST
                .antMatchers(HttpMethod.POST,
anonymousUrls.get(RequestMethodEnum.POST.getType()).toArray(newString[0])).permitAll()
// PUT
                .antMatchers(HttpMethod.PUT,
anonymousUrls.get(RequestMethodEnum.PUT.getType()).toArray(newString[0])).permitAll()
// PATCH
                .antMatchers(HttpMethod.PATCH,
anonymousUrls.get(RequestMethodEnum.PATCH.getType()).toArray(newString[0])).permitAll()
// DELETE
                .antMatchers(HttpMethod.DELETE,
anonymousUrls.get(RequestMethodEnum.DELETE.getType()).toArray(newString[0])).permitAll()
// 所有类型的接口都放行
                .antMatchers(anonymousUrls.get(RequestMethodEnum.ALL.getType()).toArray(newString[0])).permitAll()
// 所有请求都需要认证
                .anyRequest().authenticated()
                .and().apply(securityConfigurerAdapter());
}
```



### **越权处理**

下面的`if (! checkLevel(id))`判断条件表示如果当前用户的权限级别 > 被删除的用户权限级别，则向下执行，若当前用户的权限级别 <= 被删除的用户，则抛出异常。

```java
@ApiOperation("删除用户")
@DeleteMapping
@PreAuthorize("@smpe.check('user:del')")
@Transactional(rollbackFor=Exception.class)
publicResult<Void>delete(@RequestBodySet<Long>ids) {
for (Longid : ids) {
if (!checkLevel(id)) { // 通过checkLevel()方法判断当前用户是否越权，并返回对应的信息。
log.error("【删除用户失败】角色权限不足，不能删除。"+"操作人id："+SecurityUtils.getCurrentUserId() +"。预删除用户id："+id);
thrownewBadRequestException("角色权限不足，不能删除："+userService.getById(id).getUsername());
        }
    }
booleanisDel=userService.removeByIds(ids);
if (!isDel) {
log.error("【删除用户失败】角色权限不足，不能删除。"+"操作人id："+SecurityUtils.getCurrentUserId() +"。预删除用户id集合："+ids);
thrownewBadRequestException("【删除用户失败】"+"操作人id："+SecurityUtils.getCurrentUserId());
    }
returnResult.success();
}
```



源码

通过`checkLevel()`方法处理越权行为

```java
/**
* description:操作多个角色时，判断用户权限（通过role的level）
* @param roleIds 预操作角色的id集合
* @return true 有权限
*/
privatebooleancheckLevel(Set<Long>roleIds) {
IntegercurrentLevel=Collections.min(roleService.findRoleByUserId(SecurityUtils
                .getCurrentUserId()).stream().map(RoleSmallDTO::getLevel).collect(Collectors.toList()));
IntegeroptLevel=roleService.findRoleMinLeave(roleIds);
//level 越小权限越大
returncurrentLevel<=optLevel;
    }

/**
* description:操作用户时，判断用户权限
* @param userId 预操作用户id
* @return true 有权限
*/
privatebooleancheckLevel(LonguserId) {
IntegercurrentLevel=
Collections.min(roleService.findRoleByUserId(SecurityUtils.getCurrentUserId()).stream().map
                        (RoleSmallDTO::getLevel).collect(Collectors.toList()));
IntegeroptLevel=
Collections.min(roleService.findRoleByUserId(userId).stream().map(RoleSmallDTO::getLevel).collect
                        (Collectors.toList()));
//level 越小权限越大
returncurrentLevel<=optLevel;
    }
```



## **系统缓存**

缓存我们使用的是Redis，默认使用Spring的注解对系统缓存进行操作。

配置文件位于**smpe-common**模块下的**marchsoft\config\RedisConfig.java**目录。

同时我们提供了redis常用的工具类,位于**smpe-common**模块下的**marchsoft\utils\RedisUtils.java**目录。

### **缓存注解**

```
@CacheConfig：主要用于配置该类中会用到的一些共用的缓存配置
@Cacheable：主要方法的返回值将被加入缓存。在查询时，会先从缓存中获取，若不存在才再发起对数据库的访问                       
@CachePut：主要用于数据新增和修改操作  
@CacheEvict：配置于函数上，通常用在删除方法上，用来从缓存中移除相应数据
```

使用方法：

```java
@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "menu")
@Slf4j
public class MenuServiceImpl extends BasicServiceImpl<MenuMapper, Menu> implements IMenuService {
}
```



## **异常处理**

我们开发项目时，数据在请求过程中发生错误是避免不了的，我们需要捕获这些异常信息，做统一的异常处理。

如：登陆失败，权限不足，数据为空，请求失败等。这些异常如果不经过处理，会对前端小伙伴造成非常大的困扰。

做统一的异常返回，是项目中必不可少的一个模块。

### **自定义异常**

1. 通用异常

   1. 封装了BadRequestException作为通用的异常处理	

      1. 

         ```java
         @Getter
         public class BadRequestException extends RuntimeException {
         
         private Integer status = BAD_REQUEST.value();
         
         public BadRequestException(String msg) {
         super(msg);
             }
         
         public BadRequestException(Integer status, String msg) {
         super(msg);
         this.status = status;
             }
         
         public BadRequestException(ResultEnum resultEnum) {
         super(resultEnum.getMsg());
         this.status = resultEnum.getCode();
             }
         
         }
         ```

         

   2. 处理自定义异常(在全局异常处理中：src/main/java/marchsoft/exception/handler/GlobalExceptionHandler.java)

      1. 

         ```java
         /**
          * 功能描述：处理自定义异常
          *
          * @param e 自定义异常
          * @return restful风格的异常信息
          * @author RenShiWei
          * Date: 2020/4/13 22:18
          */
         @ExceptionHandler(value = BadRequestException.class)
         public ResponseEntity<Result<String>> badRequestException(BadRequestException e) {
         log.error(e.getMessage(), e);
         //默认到后端的请求，状态码都为200，自定义的异常由封装的code去控制
             return ResponseEntity.status(HttpStatus.OK).body(Result.error(e.getMessage()));
         }
         ```

2. 其他异常的处理

   1. 权限不足异常

      1. 

         ```java
         /**
          * description: security的角色权限不足异常
          *
          * @param e 权限不足异常
          * @return 200状态码 403自定义code
          * @author RenShiWei
          * Date: 2020/8/7 19:52
          */
         @ExceptionHandler(AccessDeniedException.class)
         public ResponseEntity<Result<String>> handleAccessDeniedException(AccessDeniedException e) {
         log.error(e.getMessage(), e);
         return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Result.error(ResultEnum.IDENTITY_NOT_POW.getCode(),
                     ResultEnum.IDENTITY_NOT_POW.getMsg()));
         }
         ```

   2. 不可知异常处理

      1. 

         ```java
         /**
          * 功能描述：处理所有不可知的异常
          * @param e 异常 Throwable(异常的根类)
          * @return 异常对象信息
          * @author RenShiWei
          * Date: 2020/7/10 10:54
          */
         @ExceptionHandler(Throwable.class)
         public ResponseEntity<Result<String>> handleException(Throwable e) {
         // 打印堆栈信息
             log.error(e.getMessage(), e);
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.error(ResultEnum.SEVER_ERROR.getCode(), ResultEnum.SEVER_ERROR.getMsg()));
         }
         ```

   3. 其他异常处理

      1. 详情	请见：`src/main/java/marchsoft/exception/handler/GlobalExceptionHandler.java`

```java
// 通用异常
throw new BadRequestException("发生了异常");
// 通用异常，使用自定义状态码
throw new BadRequestException(HttpStatus.OK, "发送了异常");
```



## **代码生成**

代码生成是在smpt-system包下完成的，目录如下：

<img :src="$withBase('/img/image19.png')" alt="foo">

**进行MybatisPlus代码生成的模板配置**

这里使用了自定义模板引擎（freemarker），这样才方便我们进行深度定制。（当然也可以使用官方的默认配置）。

模板引擎文件放置目录：

<img :src="$withBase('/img/image20.png')" alt="foo">

### **步骤一：确定代码生成位置及作者信息**

#### **1.1是否在项目根目录下生成代码（y为是，n为否）。多模块开发，要在子模块下生成代码请输入n**

如果不是多模块开发，或者想要在根父工程生成代码，直接输入y。

如果想要在子模块生成代码，输入n。

#### **1.2在项目指定模块下生成代码，请输入模块名**

如果上一步输入n，则在这一步输入想要生成代码的子模块名。（上一步输入y，则跳过这一步）

#### **1.3作者名（方便生成注解及作者相关）**

#### **1.4代码生成的父级包名称（全路径）**

从模块/项目下的根包（Java的包）开始，以"."进行分级。

例如：`marchsoft.test2`

#### **1.5生成在父级包下的指定子包名称（输入n代表直接在父级包下生成）**

如果还想在子包下生成，直接输入子包的名称；如果没有子包，即在上一步父包下生成，直接输入n。

### **步骤二：确定以哪些数据库的表进行代码生成**

#### **2.1是否选择所有数据库的表（请输入y/n）**

输入y将连接的目标数据库的所有表全部进行代码生成；输入n执行接下来选择表生成代码的策略。

#### **2.2为输入生成数据库的表，n为输入排除数据库的表**

输入y代表采用选择数据库表的代码生成策略；输入n代表采用选择排除数据表的代码生成。

#### **2.3请输入生成或者排除数据库表的名称，多个用英文状态下的’,'分割**

输入表名后，按照相应的策略进行代码生成

### **参考**

我们在Mybatis-Plus代码生成器的基础上，进行了相应的配置。

使用及配置详情请参考：[自定义深度定制人性化的MyBatis-Plus的代码生成策略](https://blog.csdn.net/qq_42937522/article/details/110725251)

## **数据权限**

本系统是基于部门做的一个简单数据权限控制，也就是通过用户角色中的数据权限控制用户能看哪些数据。

### **注解方式**

现可通过注解 

```java
@DataPermission
```

 进行权限控制

### **数据权限**

系统提供了三种数据权限控制

- 全部数据权限：无数据权限限制
- 本级数据权限：限制只能看到本部门数据
- 自定义数据权限：可根据实际需要选择部门控制数据权限

<img :src="$withBase('/img/image21.png')" alt="foo">



## **定时任务**

框架对定时任务做了整合

对于简单的定时任务可以只使用spring 的@sechduled 注解

对于动态管理动态任务，涉及到定时任务的增删改，以及数据库持久化储存，本框架整合了quartz，可通过后台管理页面对定时任务进行增删改查操作，

并对定时任务进行了日志监控



本模块的源码在 smpe-system\src\main\java\marchsoft\modules\quartz



后台页面展示： 

<img :src="$withBase('/img/image22.png')" alt="foo">



### 具体使用步骤：

1. 新增定时任务

打开定时任务调度界面，点击新增，填写具体参数

<img :src="$withBase('/img/image23.png')" alt="foo">



**参数解释**

- 任务名称：当前任务的名称，可以自定义
- 任务描述：对该任务的描述
- bean名称： 定时任务通过bean名称来获取具体执行的bean对象。需要执行的定时任务类，必须注入spring容器中。
- 执行方法：  需要执行的方法名称，底层是通过反射执行方法。
- cron表达式：定时任务通过cron表达式控制任务执行的时间，具体内容可以查询官方cron表达式介绍
- 子任务id：子任务可以是当前已经定义过的任务的id，传入时需要用多个逗号隔开，当主任务执行后，子任务后按顺序依次执行。
- 任务负责人：该任务的负责人
- 告警邮箱：定时任务执行失败时会将失败信息通过邮箱发送给用户。如果有多个邮箱可以用逗号隔开，如果不需要则不用填。（该功能暂不支持）
- 失败后暂停：选择定时任务失败后是否暂停当前定时任务。
- 任务状态：选择是否开启当前定时任务。
- 参数内容： 填写参数内容，可向后端传一个字符串参数，具体使用方法见下图

<img :src="$withBase('/img/image24.png')" alt="foo">



<img :src="$withBase('/img/image25.png')" alt="foo">



<img :src="$withBase('/img/image26.png')" alt="foo">



前端可以根据该参数向后端传需要执行的内容。

### **原理解释**

本框架使用的是spring quartz框架，详细解释可以参考博客[](https://blog.csdn.net/qq_45473439/article/details/113357101)

关于quartz框架的持久化操作，详情可以看本模块的源码 smpe-system\src\main\java\marchsoft\modules\quartz

## **异步线程池**

代码地址：smpe-common\src\main\java\marchsoft\config\bean\AsyncTaskProperties.java

源码如下：

```java
/**
 * description:异步任务线程池装配类
 *
 * @author RenShiWei
 * Date: 2020/7/12 21:58
 * '@EnableAsync' 开启异步线程，
 * 重写AsyncConfigurer的方法：使用@Async标注方法执行异步任务，每次都要添加注解，可以重写spring默认线程池的方式使用的时候，
 * 只需要加@Async注解就可以，不用去声明线程池类。
 */
@Slf4j
@Configuration
@EnableAsync
@RequiredArgsConstructor
public class AsyncTaskExecutePool implements AsyncConfigurer {

/** 注入配置类 */
    private final AsyncTaskProperties config;

/**
     * description: 设置线程池的参数配置
     *
     * @author RenShiWei
     * Date: 2020/8/11 15:44
     */
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
// 核心线程池大小
        executor.setCorePoolSize(config.getCorePoolSize());
// 最大线程数
        executor.setMaxPoolSize(config.getMaxPoolSize());
// 队列容量
        executor.setQueueCapacity(config.getQueueCapacity());
// 活跃时间
        executor.setKeepAliveSeconds(config.getKeepAliveSeconds());
// 线程名字前缀
        executor.setThreadNamePrefix("smpe-async-");
// setRejectedExecutionHandler：当pool已经达到max size的时候，如何处理新任务
        // CallerRunsPolicy：不在新线程中执行任务，而是由调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
return executor;
    }

/**
     * description: 异步任务的异常处理
     *
     * @author RenShiWei
     * Date: 2020/8/11 15:40
     */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, objects) -> {
            log.error("====" + throwable.getMessage() + "====", throwable);
            log.error("exception method:" + method.getName());
        };
    }

}
```



使用方式如下

```
使用@EnableAsync来开启异步的支持，使用@Async来对某个方法进行异步执行。
```



## **线程池工具**

代码地址：smpe-common\src\main\java\marchsoft\utils\ThreadPoolExecutorUtil.java

源码如下：

```java
/**
 * description: 自定义线程池工具类
 *
 * @author RenShiWei
 * Date: 2020/7/12 21:58
 */
public class ThreadPoolExecutorUtil {

public static ThreadPoolExecutor getPoll() {
        AsyncTaskProperties properties = SpringContextHolder.getBean(AsyncTaskProperties.class);
return new ThreadPoolExecutor(
                properties.getCorePoolSize(),
                properties.getMaxPoolSize(),
                properties.getKeepAliveSeconds(),
                TimeUnit.SECONDS,
new ArrayBlockingQueue<>(properties.getQueueCapacity()),
new TheadFactoryName());
    }
}
```

使用方式:

```java
privatefinalstaticThreadPoolExecutor executor =ThreadPoolExecutorUtil.getPoll();
```


## **分页实现**

- 后端实现分页：本项目在smpe-common模块utils包下的PageUtil中封装了适用于多种情况的分页查询。
  - 例如：

```java
/**
 * description:根据分页条件构建分页查询IPage
 *
 * @param current       当前页
 * @param size          当前页条数
 * @param orderItemList 排序规则集合
 * @return IPage查询条件
 * @author RenShiWei
 * Date: 2020/11/22 17:19
 */
public static <K> IPage<K> buildPage(int current, int size, List<OrderItem> orderItemList) {
    Page<K> page = new Page<>(current, size);
    page.addOrder(orderItemList);
    return page;
}
```



常见坑点1：`selectPostById`

莫名其妙的分页。例如下面这段代码

```java
startPage();
List<User> list;
if(user !=null){ 
    list = userService.selectUserList(user);
}else{
     list =newArrayList<User>();
}
Post post = postService.selectPostById(1L);
returngetDataTable(list);
```



原因分析：这种情况下由于' user ' 存在' null ' 的情况，就会导致 ' pageHelper '生产了一个分页参数，但是没有被消费，这个参数就会一直保留在这个线程上。 当这个线程再次被使用时，就可能导致不该分页的方法去消费这个分页参数，这就产生了莫名其妙的分页。

上面这个代码，应该写成下面这个样子才能保证安全。

```java
List<User> list;
if(user !=null){
    startPage(); 	
    list = userService.selectUserList(user);
}else{ 	
    list =newArrayList<User>();
}
Post post = postService.selectPostById(1L);
returngetDataTable(list);
```



常见坑点2：添加了  ’ startPage ’方法。也没有正常分页。例如下面这段代码

```java
startPage();
Post post = postService.selectPostById(1L);
List<User> list = userService.selectUserList(user);
return getDataTable(list);
```



原因分析：只对该语句以后的第一个查询 （Select）语句得到的数据进行分页。

上面这个代码，应该写成下面这个样子才能正常分页。

```java
Post post = postService.selectPostById(1L);
startPage();
List<User> list = userService.selectUserList(user);
returngetDataTable(list);
```

   注意

如果改为其他数据库需修改配置 '  application-dev.yml '文件中的属性

```
url:你的数据库
username: 用户名
password: 密码
```



## **部署项目todo**

参考：

1. [docker安装及docker常用命令](https://blog.csdn.net/qq_42937522/article/details/106274293)
2. [docker 构建git+maven+jdk8的centos7环境，实现轻量级的springboot项目的自动化部署](https://blog.csdn.net/qq_42937522/article/details/107755941)
3. [docker安装nginx规范所有项目的反向代理(一个项目一个反向代理的conf配置文件)](https://blog.csdn.net/qq_42937522/article/details/108179441)
4. [docker 构建centos7+git+nvm镜像，实现自主切换node版本统一部署前端vue项目](https://blog.csdn.net/qq_42937522/article/details/108702775)

