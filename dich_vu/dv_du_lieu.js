var NodeJs_Dich_vu = require("http")
var Luu_tru = require("../xu_ly/xl_luu_tru")
var Gui_thu = require("../xu_ly/xl_gui_thu")
var Port = normalizePort(process.env.PORT || 1000)
var Xu_ly_Tham_so = require('querystring')
var Du_lieu = {}
Du_lieu.ds_mon_an = Luu_tru.Doc_Du_lieu("Mat_hang")
Du_lieu.Cua_hang = Luu_tru.Doc_Thong_tin_Cua_hang()
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://admin:minhtien96@ds259154.mlab.com:59154/js245_doan';
var ds_ban;
var cl_ban;
var cl_hoadon;
var db;
MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log('Không kết nối với CSDL. Error:', err);
  } else {
    console.log('Kết nối thành công', url);
    var csdl = "js245_doan"; // Khai báo CSDL
    // Xác định CSDL 
    db = client.db(csdl)
    // Chọn Collection
    cl_ban = db.collection("ban")
    cl_hoadon = db.collection("hoa_don")

  }
});
async function thay_doi_trang_thai_hoa_don(mahd, trangthai) {
  cl_hoadon.update({
    'ma_hd': Number(mahd)
  }, {
    $set: {
      'trang_thai': trangthai
    }
  })
}
var Dich_vu = NodeJs_Dich_vu.createServer((Yeu_cau, Dap_ung) => {
  var Chuoi_Nhan = ""
  var Dia_chi_Xu_ly = Yeu_cau.url.replace("/", "")
  var thamso2;
  Yeu_cau.on('data', (chunk) => {
    Chuoi_Nhan += chunk
    console.log(chunk);

  }) //data: nhận dl từ client(như ajax)
  Yeu_cau.on('end', async () => { //end: trả kq lại cho client
    if (Dia_chi_Xu_ly.indexOf('/') >= 0) {
      var giatri = Dia_chi_Xu_ly.split('/')
      Dia_chi_Xu_ly = giatri[0];
      tham_so_phu = giatri[1];
      var thamso2 = Xu_ly_Tham_so.parse(tham_so_phu.replace("?", ""))
      var laythamsao = thamso2.thamso
    }
    var Tham_so = Xu_ly_Tham_so.parse(Dia_chi_Xu_ly.replace("?", ""))
    var Ma_so_Xu_ly = Tham_so.Ma_so_Xu_ly
    var Chuoi_Kq = ""
    if (Ma_so_Xu_ly == "Doc_ds_mon_an") {
      var Doi_tuong_Kq = Du_lieu.ds_mon_an
      Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
      Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
      Dap_ung.end(Chuoi_Kq);
    } else if (Ma_so_Xu_ly == "danh_sach_hoa_don") {
      cl_hoadon = await db.collection("hoa_don")
      cl_hoadon.find({}).sort({'ngay_lap':-1}).toArray((err, res) => {
        if (res) {
          Chuoi_Kq = JSON.stringify(res)
          Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
          Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
          Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
          Dap_ung.end(Chuoi_Kq);
        }
      })

    } else if (Ma_so_Xu_ly == "xu_ly_thanh_toan") {
      cl_hoadon = await db.collection("hoa_don")
      var data = JSON.parse(Chuoi_Nhan)
      var dk = {
        'ma_hd': Number(data.ma_hd)
      }
      cl_hoadon.update(dk, {
        $set: {
          'trang_thai': data.trang_thai
        }
      }, (err, res) => {
        if (res) {
          Chuoi_Kq = JSON.stringify('ok')
          Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
          Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
          Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
          Dap_ung.end(Chuoi_Kq);
        }
      })

    } else if (Ma_so_Xu_ly == "xu_ly_ngung_phuc_vu") {
      cl_ban = await db.collection("ban")
      var data = JSON.parse(Chuoi_Nhan)
      var dk = {
        'ma_ban': Number(data.ma_ban)
      }
      cl_ban.update(dk, {
        $set: {
          'trang_thai': 'trống',
          'hoa_don_phuc_vu': ''
        }
      }, (err, res) => {
        if (res) {
          Chuoi_Kq = JSON.stringify('ok')
          Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
          Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
          Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
          Dap_ung.end(Chuoi_Kq);
        }
      })

    } else if (Ma_so_Xu_ly == "Khach_hang_Lien_he") {
      var from = "long4581994@gmail.com"
      var to = "buckblack44@gmail.com"
      var subject = "Khách hàng liên hệ"
      var body = Chuoi_Nhan
      var kqPromise = Gui_thu.Gioi_Thu_Lien_he(from, to, subject, body)
      kqPromise.then(result => {
        console.log(result);
        Chuoi_Kq = "OK";
        Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
        Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
        Dap_ung.end(Chuoi_Kq);
      }).catch(err => {
        console.log(err);
        Chuoi_Kq = "Error";
        Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
        Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
        Dap_ung.end(Chuoi_Kq);
      })
    } else if (Ma_so_Xu_ly == "danh_sach_ban") {
      cl_ban = db.collection("ban")
      ds_ban = await cl_ban.find({}).toArray((err, req) => {
        if (err)
          console.log(err);
        else {
          var Doi_tuong_Kq = req
          Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
          Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
          Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
          Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
          Dap_ung.end(Chuoi_Kq);
        }
      })

    } else if (Ma_so_Xu_ly == "doi_so_luong") {
      var data = JSON.parse(Chuoi_Nhan);
      var dk = {
        'ma_hd': Number(data.ma_hd),
        'chi_tiet.ma_sp': data.ma_sp
      }
      cl_hoadon = db.collection("hoa_don")
      await thay_doi_trang_thai_hoa_don(data.ma_hd, 'chưa thanh toán')
      cl_hoadon.update(dk, {
        $set: {
          "chi_tiet.$.so_luong": Number(data.so_luong)
        }
      }, (err, res) => {
        var Doi_tuong_Kq = 'ok'
        Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
        Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
        Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
        Dap_ung.end(Chuoi_Kq);
      })

    } else if (Ma_so_Xu_ly == "xoa_chi_tiet") {
      var data = JSON.parse(Chuoi_Nhan);
      var dk = {
        'ma_hd': Number(data.ma_hd),
        'chi_tiet.ma_sp': data.ma_sp
      }
      cl_hoadon = db.collection("hoa_don")
      cl_hoadon.update(dk, {
        '$pull': {
          'chi_tiet': {
            'ma_sp': data.ma_sp
          }
        }
      }, {
        multi: true
      }, (err, res) => {
        var Doi_tuong_Kq = 'ok'
        Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
        Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
        Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
        Dap_ung.end(Chuoi_Kq);
      })

    } else if (Ma_so_Xu_ly == "thong_tin_mon_an") {
      var data = JSON.parse(Chuoi_Nhan);
      var Doi_tuong_Kq = Du_lieu.ds_mon_an.find(x => x.Ma_so == data.ma_sp);
      Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
      Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
      Dap_ung.end(Chuoi_Kq);

    } else if (Ma_so_Xu_ly == "chon_mon_an_vao_chi_tiet") {
      var kq = JSON.parse(Chuoi_Nhan);
      var Doi_tuong_Kq;
      cl_hoadon = await db.collection("hoa_don")
      await thay_doi_trang_thai_hoa_don(kq.ma_hd, 'chưa thanh toán')
      cl_ban = await db.collection("ban")
      await cl_hoadon.findOne({
        'ma_hd': Number(kq.ma_hd)
      }, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          if (res == null) {
            //tạo hóa đơn mới
            var hd_moi = {
              "ma_hd": Number(kq.ma_hd),
              "ngay_lap": new Date(),
              "trang_thai": "Chưa thanh toán",
              "ma_nv": "1",
              "ten_nv": "Tiến",
              "ma_ban": kq.ma_ban,
              "tong_tien": 0,
              "chi_tiet": [kq.chi_tiet]
            }
            cl_hoadon.insert(hd_moi, async (Loi, Ket_qua) => {
              if (Loi) {
                console.log(Loi)
              } else {
                await cl_ban.update({
                  'ma_ban': kq.ma_ban
                }, {
                  $set: {
                    'trang_thai': 'đang phục vụ',
                    'hoa_don_phuc_vu': kq.ma_hd.toString()
                  }
                })


                Doi_tuong_Kq = 'ok'
                console.log(Doi_tuong_Kq);
                Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
                Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
                Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
                Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
                Dap_ung.end(Chuoi_Kq);


              }
            })
          } else {
            var ct = res.chi_tiet.find(x => x.ma_sp == kq.ma_mon);
            if (ct == undefined) {
              var c = {
                ma_sp: "CA_PHE_13",
                ten_sp: "Cafe Sữa Đá",
                gia_ban: 33800,
                so_luong: 1
              }
              cl_hoadon.update({
                'ma_hd': Number(kq.ma_hd)
              }, {
                $push: {
                  chi_tiet: kq.chi_tiet
                }
              });
              Doi_tuong_Kq = 'ok'
              console.log(Doi_tuong_Kq);
              Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
              Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
              Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
              Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
              Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
              Dap_ung.end(Chuoi_Kq);

            } else {
              cl_hoadon.update({
                'ma_hd': Number(kq.ma_hd),
                'chi_tiet.ma_sp': kq.ma_mon
              }, {
                $set: {
                  "chi_tiet.$.so_luong": Number(ct.so_luong) + 1
                }
              });
              Doi_tuong_Kq = 'ok'
              console.log(Doi_tuong_Kq);
              Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
              Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
              Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
              Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
              Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
              Dap_ung.end(Chuoi_Kq);
            }

            /*var x = {
              "ma_sp": "CA_PHE_3",
              "ten_sp": "Cafe sữa",
              "gia_ban": 20000,
              "so_luong": 1
            };
            cl_hoadon.update({
              'ma_hd': 2
            }, {
              $push: {
                chi_tiet: x
              }
            });*/

            //cl_hoadon.update({'ma_hd':1,'chi_tiet.ma_sp':'CA_PHE_1'},{$set: {"chi_tiet.$.so_luong": 3}});

            //cl_hoadon.update({ 'ma_hd':2},{'$pull':{ 'chi_tiet':{'ma_sp': 'CA_PHE_1' }}},{multi:true})

            /*cl_hoadon.chi_tiet.insert(hd_moi, (Loi, Ket_qua) => {
              if (Loi) {
                console.log(Loi)
              } else {
                console.log(Ket_qua)
              }
            })*/
          }
        }
      })

      /*Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
      Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
      Dap_ung.end(Chuoi_Kq);*/


    } else if (Ma_so_Xu_ly == "hoa_don_moi") {
      cl_hoadon.find({}).toArray((err, req) => {
        if (err)
          console.log(err);
        else {
          var Doi_tuong_Kq = req.length + 1;
          Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
          Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
          Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
          Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
          Dap_ung.end(Chuoi_Kq);
        }
      })
    } else if (Ma_so_Xu_ly == "aaa") {

      var Doi_tuong_Kq = JSON.parse(Chuoi_Nhan);
      console.log('------');
      console.log(Doi_tuong_Kq);


      Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
      Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
      Dap_ung.end(Chuoi_Kq);


    } else if (Ma_so_Xu_ly == "tim_hoa_don") {
      try {
        var dk = {
          "ma_hd": Number(laythamsao)
        }
        cl_hoadon.findOne(dk, (err, req) => {
          if (err)
            console.log(err);
          else {
            var Doi_tuong_Kq = req
            Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
            Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            Dap_ung.end(Chuoi_Kq);
          }
        })
      } catch (error) {}
    } else if (Ma_so_Xu_ly == "tim_ban") {
      try {
        var dk = {
          "ma_ban": Number(laythamsao)
        }
        cl_ban.findOne(dk, (err, req) => {
          if (err)
            console.log(err);
          else {
            var Doi_tuong_Kq = req
            Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
            Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
            Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
            Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
            Dap_ung.end(Chuoi_Kq);
          }
        })
      } catch (error) {}
    } else if (Ma_so_Xu_ly == "ghi_san_pham_moi") {
      var Kq = ""
      var sanpham = JSON.parse(Chuoi_Nhan)
      Kq = Luu_tru.Ghi_moi_Doi_tuong("Mat_hang", sanpham)
      if (Kq == "") {
        Du_lieu.ds_mon_an.push(sanpham)
        Chuoi_Kq = JSON.stringify(sanpham)
      }
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.end(Chuoi_Kq);
    } else if (Ma_so_Xu_ly == "xoa_san_pham") {
      var Kq = ""
      var data = JSON.parse(Chuoi_Nhan)
      console.log(data);
      
      Kq = Luu_tru.Xoa_Doi_tuong("Mat_hang", data)
        ds_moi = Du_lieu.ds_mon_an.filter(x => x.Ma_so != data.Ma_so);
        Du_lieu.ds_mon_an = ds_moi
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
      Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
      Dap_ung.end(Chuoi_Kq);
    } else {
      Chuoi_Kq = Luu_tru.Doc_Thong_tin_Dich_vu()
      Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
      Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
      Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
      Dap_ung.end(Chuoi_Kq);
    }
  })
})

Dich_vu.listen(Port);
Dich_vu.on('error', onError);
Dich_vu.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof Port === 'string' ?
    'Pipe ' + Port :
    'Port ' + Port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = Dich_vu.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
}