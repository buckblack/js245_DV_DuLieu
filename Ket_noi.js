var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://admin:minhtien96@ds259154.mlab.com:59154/js245_doan';
//mongodb://tienhm:minhtien96@ds123434.mlab.com:23434/ban_dien_thoai_tien

MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log('Không kết nối với CSDL. Error:', err);
  } else {
    console.log('Kết nối thành công', url);
  }
});