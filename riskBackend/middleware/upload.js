const multer=require('multer')
const path=require('path')  
const hash = require('random-hash'); 
const storage=multer.diskStorage({
  destination: (req,file,cb) => {
    // console.log(file,"file")
    cb(null, __basedir + "/upload");
  },
  filename: (req,file,cb) => {
    let temp = file.originalname.replace(/\s+/g, '').split('.');
    const filename = temp[0] + '-' + hash.generateHash({length: 5}) + '.' + temp[1]
    cb(null, filename);
    //   cb(null, new Date().getTime() + path.extname(file.originalname))
  }  
}) 
const fileFilter= (req,file,cb,res) => {
  const ext = path.extname(file.originalname);
  const allowed = ['.png', '.jpg', '.jpeg', '.pdf','.mp4','.gif','.mkv','.mov','.ogg','.mp3','.webm','.csv','.xls','.xlsx','.docx','.xml','.txt','.svg','.zip'];
  // const allowed = '*';
//   console.log(ext,"ext")
  if(allowed.includes(ext)){
    cb(null,true);
  }
else{

    cb(null,false)
   
}
}
const upload=multer({
    storage:storage,
    
    // limits:{
    //     fileSize:1024*1024*10
    // },
    // fileFilter:fileFilter
   
})

module.exports=upload;