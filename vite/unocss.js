import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import tools from "../src/utils/common"
import  icons from "../src/utils/fileType"
export default function createUnocss () {
  let arr = Object.keys(icons)
  for (const item in tools.iconList) {
    arr = arr.concat(tools.iconList[item])
  }
  return Unocss({
    safelist: arr,
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons()],
  });
}