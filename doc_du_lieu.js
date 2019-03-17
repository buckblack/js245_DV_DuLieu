var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://admin:minhtien96@ds259154.mlab.com:59154/js245_doan';
MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log('Không kết nối với CSDL. Error:', err);
  } else {
    console.log('Kết nối thành công', url);
    var csdl = "js245_doan"; // Khai báo CSDL
    // Xác định CSDL 
    var db = client.db(csdl)
    // Chọn Collection
    var cl_ban = db.collection("ban")
    console.log(cl_ban);
    var ds_ban=cl_ban.find({}).toArray((err,req)=>{
        if(err)
        console.log(err);
        else
        console.log(req);
        })
    //var Bang_Dien_thoai = db.collection("Dien_thoai")
    //var Bang_Cua_hang = db.collection("Cua_hang")
    // Lấy thông tin cửa hàng
    // Bang_Cua_hang.find({}).toArray(function (Loi, Cua_hang) {
    //   if (Loi) {
    //     console.log(Loi)
    //   } else {
    //     console.log(Cua_hang)
    //   }
    // })

    // Lấy danh sách điện thoại
    // Bang_Dien_thoai.find({}).toArray(function (Loi, Danh_sach_Dien_thoai) {
    //   if (Loi) {
    //     console.log(Loi)
    //   } else {
    //     console.log(Danh_sach_Dien_thoai)
    //   }
    // })

    // Lấy Điện thoại có Mã số là Iphone_1: findOne
    
    /*var Dk = {
      "Ma_so": "IPHONE_18"
    }
    Bang_Dien_thoai.findOne(Dk, function (Loi, Dien_thoai) {
      if (Loi) {
        console.log(Loi)
      } else {
        console.log(Dien_thoai) // Dien_thoai: Object
      }
    })*/
    /*
    // Lấy Điện thoại có Mã số là Iphone_1: find
    Bang_Dien_thoai.find(Dk).toArray(function (Loi, Danh_sach_Dien_thoai) {
      if (Loi) {
        console.log(Loi)
      } else {
        console.log(Danh_sach_Dien_thoai)
      }
    })
    */
    // Lấy Điện thoại theo Nhóm điện thoại: IPHONE
    /*var Dk = {
      "Nhom_Dien_thoai.Ma_so": "IPHONE"
    }
    Bang_Dien_thoai.find(Dk).toArray(function (Loi, Danh_sach_Dien_thoai) {
      if (Loi) {
        console.log(Loi)
      } else {
        console.log(Danh_sach_Dien_thoai)
      }
    })
    */
     // Lấy Điện thoại có giá bán lớn hơn 15000000
    // var Dk = {
    //   "Don_gia_Ban":{$gt:15000000}
    // }
    // Bang_Dien_thoai.find(Dk).toArray(function (Loi, Danh_sach_Dien_thoai) {
    //   if (Loi) {
    //     console.log(Loi)
    //   } else {
    //     console.log(Danh_sach_Dien_thoai)
    //   }
    // })

    // Lấy Điện thoại có giá bán nhỏ hơn 15000000 và nhóm Iphone sắp xếp giảm dần theo Đơn giá bán
    /*var Dk = {
      $and:[{"Don_gia_Ban":{$lt:15000000}},{"Nhom_Dien_thoai.Ma_so":"IPHONE"}]

    }
    Bang_Dien_thoai.find(Dk).sort({"Don_gia_Ban":-1}).skip(1).limit(5).toArray(function (Loi, Danh_sach_Dien_thoai) {
      if (Loi) {
        console.log(Loi)
      } else {
        console.log(Danh_sach_Dien_thoai)
      }
    })*/




  }
});