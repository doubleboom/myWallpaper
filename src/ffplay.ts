import { resolve } from 'path'
import type * as child_process from 'child_process'
import spawn from 'cross-spawn'

const ffplayPath = resolve(__dirname, '../../ffmpeg/bin/ffplay.exe')

interface IFfplayOptions {
  path: string
}

class Ffplay {
  public path: string
  protected defaultOpt: IFfplayOptions = { path: ffplayPath }
  private child: child_process.ChildProcess | null = null
  constructor(options?: IFfplayOptions) {
    const mergeOpt = Object.assign(this.defaultOpt, options)
    this.path = mergeOpt.path
  }

  run(args: string[] | undefined, options?: child_process.SpawnOptions | undefined) {
    this.child = spawn(this.path, args, Object.assign({ stdio: 'inherit' }, options))
  }

  stop() {
    this.child?.kill()
  }
}

export default Ffplay
