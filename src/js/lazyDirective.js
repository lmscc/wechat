export default {
  install(app, config) {
    app.directive('lazy', {
      mounted(el, context) {
        el.onerror = function (...args) {
          //         data-src            指令的第二个参数          错误
          el.src = el.dataset.src || config[context.value[1]] || config.error
        }
        //会造成页面闪动
        let intersectionObserver = new IntersectionObserver(function (entries) {
          if (entries[0].intersectionRatio <= 0 || el.mounted) return;
          el.mounted = true
          //        指令的第一个参数
          el.src = context.value[0]
        });
        intersectionObserver.observe(el);
      },

      updated(el, context) {
        //对于那些出错的头像,就不要在刷新的时候重新加载了,不然会闪动
        if (JSON.stringify(context.oldValue) !== JSON.stringify(context.value))
          el.src = context.value[0]
      },
    })
  }
}