var express = require('express')
var app = express()
var opn = require('opn')
/**
 * 打包后自动预览
 * @author 17101827
 */
class PreviewProdPlugin {
  constructor(opts) {
    this.opts = {
      context: '/prod',
      resourceDir: './dist',
      port: 8080
    }

    if (!!opts) {
      Object.assign(this.opts, opts);
    }
  }

  apply(compiler) {
    this.compiler = compiler;
    const {
      context,
      resourceDir,
      port
    } = this.opts;

    compiler.plugin('done', (stats) => {
      app.use(context, express.static(resourceDir));
      app.listen(port, (err) => {
        if (err) {
          console.log(err)
          return
        }
        var uri = 'http://localhost:' + port + context;
        console.log('Prod is listening at ' + uri + '\n')
        opn(uri)
      })
    });
  }

}

module.exports = PreviewProdPlugin;
