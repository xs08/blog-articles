### Hexo 写作基本操做

#### 一．模板设置

开始写作前，我们可以给自己定义一些文章模板，比如说定义好分类等．可以在scaffolds目录下定义自己需要的模板，其中feont-matter变量可以更改实现一些元数据．

| 参数             | 描述                                                 | 默认值       |
| :--------------- | :--------------------------------------------------- | :----------- |
| `layout`        | 布局                                                 |              |
| `title`         | 标题                                                 | 文章的文件名 |
| `date`          | 建立日期                                             | 文件建立日期 |
| `updated`       | 更新日期                                             | 文件更新日期 |
| `comments`      | 开启文章的评论功能                                   | true         |
| `tags`          | 标签（不适用于分页）                                 |              |
| `categories`    | 分类（不适用于分页）                                 |              |
| `permalink`     | 覆盖文章网址                                         |              |
| `keywords`      | 仅用于 meta 标签和 Open Graph 的关键词（不推荐使用） |              |

创建好的文章中，我们可以给自己的文章添加一个摘要(不指定的时候会自动生成摘要)，格式如下：

```
-------
title: { title } 
date: { date }
-------
这里是一段摘要文字，写了这段文字并且开启摘要的时候，生成器会取这段文字作为摘要，而不是自动生成摘要．
<!-- more -->
这里是文章正文内容．．．
```

#### 二．创建新文章

定义好模板之后可以使用命令：`hexo new [layout] <title>`来新建一篇文章，这个命令会使用给定的模板来生成一篇文章的框架，我们只需要将内容写入就可以啦

* [layout] scaffolds目录下定义的模板
* \<title\> 文章标题

#### 三．生成静态文件

文章写完之后需要生成静态文件部署到服务器上，使用如下命令生成:

```bash
hexo generate [options]
```

options可选如下参数：

| 选项                  | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `-d`, `--deploy`      | 文件生成后立即部署网站                                       |
| `-w`, `--watch`       | 监视文件变动                                                 |
| `-b`, `--bail`        | 生成过程中如果发生任何未处理的异常则抛出异常                 |
| `-f`, `--force`       | 强制重新生成文件 Hexo 引入了差分机制，如果 `public` 目录存在，那么 `hexo g` 只会重新生成改动的文件。 使用该参数的效果接近 `hexo clean && hexo generate` |
| `-c`, `--concurrency` | 最大同时生成文件的数量，默认无限制                           |

一般情况下，写完文章发布就ＯＫ啦(已经配置好), 这时候直接`hexo g -d`, 就会自动生成并部署了

#### 四．使用标签

Hexo提供了Markdown之外的一些功能，可以通过插入不同的标签来生成不同的内容．基本格式如下：

```
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

可在标签中引入链接，视频等．其他的标签有如下这些：

* 代码块,，Hexo支持Markdown语法的代码块(三个反引号)，同时也支持标签引用的代码块．格式如下：

```
{% codeblock [lang:js] %}
alert('Hello World!');
{% endcodeblock %}
```

* jsFiddle，在文章中嵌入 jsFiddle

```
{% jsfiddle shorttag [tabs] [skin] [width] [height] %}
```

* Gist, 在文章中嵌入 Gist

```
{% gist gist_id [filename] %}
```

* iframe，在文章中插入 iframe

```
{% iframe url [width] [height] %}
```

* Image, 引入图片，还可以在文章中插入指定大小的图片

```
{% img [class names] /path/to/image [width] [height] "title text 'alt text'" %}
```

* Link，在文章中插入链接，并自动给外部链接添加 `target="_blank"` 属性

```
{% link text url [external] [title] %}
```

* Include Code，文章中插入 `source/downloads/code` 文件夹内的代码文件．`source/downloads/code` 不是固定的，取决于你在配置文件中 `code_dir` 的配置。

```
{% include_code [title] [lang:language] [from:line] [to:line] path/to/file %}
```

* 引用文章，引用其他文章的链接。

```
{% post_path slug %}
{% post_link slug [title] [escape] %}
```

在使用此标签时可以忽略文章文件所在的路径或者文章的永久链接信息、如语言、日期。例如，在文章中使用 `{% post_link how-to-bake-a-cake %}` 时，只需有一个名为 `how-to-bake-a-cake.md` 的文章文件即可。即使这个文件位于站点文件夹的 `source/posts/2015-02-my-family-holiday` 目录下、或者文章的永久链接是 `2018/en/how-to-bake-a-cake`，都没有影响。

默认链接文字是文章的标题，你也可以自定义要显示的文本。此时不应该使用 Markdown 语法 `[]()`。使用方式如下：

```
{% post_link some-post '这是一段描述文字' %}
```

