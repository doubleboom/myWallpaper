import { resolve } from 'path'
// import { CPP, L, NULL, Win32ffi, ffi } from 'win32-ffi'
import Ffplay from './ffplay'
import { GetProgmanDpi, SetLayeredWindowAttributes, SetWallpaper } from './window'
export const STREAM_URL = resolve(__dirname, './video/mixkit-stars-in-space-1610.mp4')
const dpi = GetProgmanDpi()
console.log(dpi)
// SetLayeredWindowAttributes(0x00440A5A)
const ffplay = new Ffplay()
ffplay.run([STREAM_URL, '-noborder', '-x', String(1920 * dpi), '-y', String(1080 * dpi), '-loop', '0', '-loglevel', 'quiet'])
setTimeout(() => {
  SetWallpaper()
}, 300)
