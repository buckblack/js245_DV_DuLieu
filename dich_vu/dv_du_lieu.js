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
var Dich_vu = NodeJs_Dich_vu.createServer((Yeu_cau, Dap_ung) => {
  var Chuoi_Nhan = ""
  var Dia_chi_Xu_ly = Yeu_cau.url.replace("/", "")
  var thamso2;
  Yeu_cau.on('data', (chunk) => {
    Chuoi_Nhan += chunk
  }) //data: nhận dl từ client(như ajax)
  Yeu_cau.on('end', () => { //end: trả kq lại cho client
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
      ds_ban = cl_hoadon.find({}).toArray((err, req) => {
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

    }else if (Ma_so_Xu_ly == "hoa_don_moi") {
      ds_ban = cl_hoadon.find({}).toArray((err, req) => {
        if (err)
          console.log(err);
        else {
          var Doi_tuong_Kq =Number(req[req.length-1].ma_hd)+1
          Chuoi_Kq = JSON.stringify(Doi_tuong_Kq)
          Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
          Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
          Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
          Dap_ung.end(Chuoi_Kq);
        }
      })
    } else if (Ma_so_Xu_ly == "tim_hoa_don") {
      try {
        var dk = {
          "ma_hd": Number(laythamsao)
        }
        cl_hoadon.find(dk,(err, req) => {
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
      } catch (error) {
      }
    }else if (Ma_so_Xu_ly == "tim_ban") {
      try {
        var dk = {
          "ma_ban": Number(laythamsao)
        }
        cl_ban.findOne(dk,(err, req) => {
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
      } catch (error) {
      }
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