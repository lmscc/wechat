self.importScripts("./spark-md5.min.js"); // 导入脚本
self.addEventListener('message', function (event) {
    const spark = new self.SparkMD5.ArrayBuffer()
    const reader = new FileReader();
    reader.readAsArrayBuffer(event.data.file);
    
    reader.onload = e => {
        spark.append(e.target.result);
        self.postMessage({
            md5: spark.end(),
            file:event.data.file,
            fileType:event.data.fileType
        });
       
    };

  
  }, false);