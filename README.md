bpmn-js核心是围绕一些基本服务构建的:

 

● Canvas -提供了添加和删除图形元素的api;处理元素生命周期，并提供用于缩放和滚动的api。

● EventBus -该库的全局通信通道具有防火和遗忘策略。可以订阅各种事件，并在事件发出后立即采取行动。事件总线帮助我们解耦关注点并模块化功能，以便新特性能够轻松地与现有行为挂钩。

● ElementFactory -根据bpmn-js的内部数据模型创建形状和连接的工厂。

● ElementRegistry—知道添加到图中的所有元素，并提供api来根据id检索元素及其图形表示。

● GraphicsFactory -负责创建图形和连接的图形表示。实际的外观是由渲染器定义的，即绘制模块中的DefaultRenderer。
## 如何使用

将项目克隆至本地:

```
git clone 
```

安装依赖:

```
yarn install
```

本地启动项目:

```
yarn run serve
```

打包发布至生成环境:

```
yarn run build
