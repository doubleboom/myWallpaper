import ffi from 'ffi-napi'
import type ref from 'ref-napi'

function L(text: string) {
  return Buffer.from(`${text}`, 'ucs2')
}

export enum SW {
  SW_HIDE = 0,
  SW_NORMAL = 1,
  SW_SHOWMINIMIZED = 2,
  SW_MAXIMIZE = 3,
  SW_SHOWNOACTIVATE = 4,
  SW_SHOW = 5,
  SW_MINIMIZE = 6,
}
type keys = 96 | 120 | 144 | 192
const DPI: Record<keys, number> = {
  96: 1,
  120: 1.25,
  144: 1.5,
  192: 2,
}

// api source:https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
const dlls = ffi.Library('user32', {
  GetActiveWindow: ['int', []],
  GetFocus: ['int', []],
  ReleaseCapture: ['bool', []],
  FindWindowW: ['uint64', ['string', 'string']],
  SetParent: ['int', ['int', 'int']],
  PostMessageW: ['int', ['int', 'uint', 'uint64', 'int64']],
  PostMessageA: ['int', ['int', 'uint', 'uint64', 'int64']],
  FindWindowExA: ['int', ['int', 'int', 'string', 'string']],
  EnumWindows: ['bool', ['pointer', 'int']],
  ShowWindow: ['bool', ['int', 'int']],
  GetDpiForWindow: ['int', ['int']],
  SetLayeredWindowAttributes: ['bool', ['int', 'int', 'uchar', 'int']],
  SetWindowLongA: ['long', ['int', 'int', 'long']],
  GetWindowLongA: ['long', ['int', 'int']],
})

export function GetProgmanDpi() {
  const hProgman = dlls.FindWindowW(L('Progman') as unknown as string, null) as number
  const zoom = dlls.GetDpiForWindow(hProgman) as keys
  return DPI[zoom]
}

export function SetLayeredWindowAttributes(hwnd: number) {
  dlls.SetWindowLongA(hwnd, -20, (dlls.GetWindowLongA(hwnd, -20) as number) | 0x00080000)

  const result = dlls.SetLayeredWindowAttributes(hwnd, 0, 50, 0x00000002)
  console.log(result)
  return result
}

export function SetWallpaper(displayHwnd?: number) {
  const hProgman = dlls.FindWindowW(L('Progman') as unknown as string, null) as number
  dlls.PostMessageW(hProgman, 0x52C, 0, 0)
  const hFfplay = displayHwnd || dlls.FindWindowW(L('SDL_app') as unknown as string, null) as number
  dlls.SetParent(hFfplay, hProgman)
  dlls.ShowWindow(hFfplay, SW.SW_SHOW)
  const createEnumWindowProc = ffi.Callback('bool', ['uint64', 'int64'], (hwnd: number) => {
    const hDefView = dlls.FindWindowExA(hwnd, 0, 'SHELLDLL_DefView', null)
    if (hDefView !== 0) {
      const hWorkerw = dlls.FindWindowExA(0, hwnd, 'WorkerW', null)
      dlls.ShowWindow(hWorkerw, SW.SW_HIDE)
      return false
    }
    return true
  })
  dlls.EnumWindows(createEnumWindowProc as ref.Pointer<unknown>, 0)
}

export default dlls
