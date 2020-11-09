export function resetRem(){
  //有些浏览器documentElement获取不到,那就使用后面的body
  let htmlWidth=document.documentElement.clientWidth || document.body.clientWidth;

  let htmlDom=document.getElementsByTagName("html")[0];

  htmlDom.style.fontSize=htmlWidth/7.5+'px';
}
