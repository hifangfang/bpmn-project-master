import CustomContextPad from './CustomContextPad'
import CustomContextPadProvider from './CustomContextPadProvider'
export default {
  __init__: ['customContextPad'],   // 依赖于 customPalette 这个模块
  customContextPad: ['type', CustomContextPad],
  contextPadProvider: ['type', CustomContextPadProvider]  //调用 customPaletteProvider 来初始化
}
