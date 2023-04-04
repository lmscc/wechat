var fs = require('fs');
var path = require('path');
 
var rootPath = path.resolve('D:\\桌面\\vue3\\wechat\\build');
var gotoPaths = ['D:\\桌面\\myserver\\wechat\\dist','D:\\桌面\\serverpack\\wechat\\dist']
var count = 0;
function emptyDir(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            emptyDir(filePath);
        } else {
            fs.unlinkSync(filePath);
            // console.log(`删除${file}文件成功`);
        }
    })
}

function rmEmptyDir(path, level=0) {
    const files = fs.readdirSync(path);
    if (files.length > 0) {
        let tempFile = 0;
        files.forEach(file => {
            tempFile++;
            rmEmptyDir(`${path}/${file}`, 1);
        });
        if (tempFile === files.length && level !== 0) {
            fs.rmdirSync(path);
        }
    }
    else {
        level !==0 && fs.rmdirSync(path);
    }
}
function clearDir(gotoPath){
    emptyDir(gotoPath)
    rmEmptyDir(gotoPath)
}
function moveFromTo(rootPath,gotoPath) {
  //根据文件路径读取文件，返回文件列表
  try{
      fs.mkdirSync(gotoPath)
  }catch(err){
    console.log(err)
  }
  fs.readdir(rootPath, function(err,files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(rootPath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir,function(eror,stats) {
          if (eror) {
            console.log('获取文件stats失败');
          } else {
            var isFile = stats.isFile();//是文件
            var isDir = stats.isDirectory();//是文件夹
            if(isFile){
              console.log(++count);
              fs.copyFile(filedir,gotoPath + filedir.replace(rootPath,''),function(err){
                if (err) { console.log(err); }
              })
            //   fs.rename(filedir, gotoPath + filedir.replace(rootPath,'') , function (err) {
            //       if (err) { console.log(err); }
            //   });
            }
            if (isDir) {
                moveFromTo(filedir,gotoPath + filedir.replace(rootPath,''));//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      });
    }
  });
}
gotoPaths.forEach((path)=>{
    clearDir(path)
    moveFromTo(rootPath,path)
})
