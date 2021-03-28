module.exports = {
    title: 'SMPE官方文档', // 网页标题
    description: 'SMPE开发文档', // 网页描述
    head: [ // 标签页图标
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    base: '/smpe-admin-doc/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        nav: [ // 导航栏配置
            { text: '项目指南', link: '/guide/' },
            { text: '常见问题', link: '/question/' },
            { text: '更新日志', link: '/note/' },
            { text: '体验地址', link: 'http://39.106.101.156:8013/' },
            // { text: '作者博客', link: 'https://blog.csdn.net/qq_42937522' },

            {
                text: 'GitHub', link: '', items: [
                    {
                        text: '地址', items: [
                            { text: '后端源码', link: 'https://github.com/sanyueruanjian/smpe-admin' },
                            { text: '前端源码', link: 'https://github.com/sanyueruanjian/smpe-admin-web' },
                        ]
                    },
                ]
            },
        ],

        sidebar: {
            '/guide/': [
                {
                    title: '指南',   // 必要的
                    // path: '/guide/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        ['', '项目介绍'],      /* /guide/ */
                        ['fastKnow', '快速了解'], /* /guide/fastIn.html */
                        ['fastStart', '快速开始'], /* /guide/fastIn.html */
                        ['frontHandbook', '前端手册'],
                        ['behindHandbook', '后端手册'],
                        ['deployProject','部署项目']
                    ],
                    initialOpenGroupIndex: 0
                },
                {
                    title: '鸣谢',   // 必要的
                    // path: '/guide/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 0,    // 可选的, 默认值是 1
                    children: [
                        ['thanks', '特别鸣谢'],      /* /guide/thanks */

                    ],
                    initialOpenGroupIndex: 0
                }

            ],
        },

        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'xuyunfeiQQ/smpe-admin-doc',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: '查看源码',

        // 以下为可选的编辑链接选项
        // 假如你的文档仓库和项目本身不在一个仓库：
        // docsRepo: 'xuyunfeiqq/smpe-admin-doc',
        // 假如文档不是放在仓库的根目录下：
        // docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'gh-pages',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '帮助我们改善此页面！',

        // algolia: {
        //     apiKey: '<API_KEY>',
        //     indexName: '<INDEX_NAME>'
        //   },

        smoothScroll: true,
        sidebarDepth: 2, // 侧边栏显示2级
        collapsable: false, // 可选的, 默认值是 true,
    }
}