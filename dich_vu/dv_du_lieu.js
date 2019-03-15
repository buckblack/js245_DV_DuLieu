var NodeJs_Dich_vu = require("http")
var Luu_tru = require("../xu_ly/xl_luu_tru")
var Gui_thu = require("../xu_ly/xl_gui_thu")
var Port = normalizePort(process.env.PORT || 1001)
var Xu_ly_Tham_so = require('querystring')
var Du_lieu = {}
Du_lieu.ds_mon_an = Luu_tru.Doc_Du_lieu("Mat_hang")
Du_lieu.Cua_hang = Luu_tru.Doc_Thong_tin_Cua_hang()

var Dich_vu = NodeJs_Dich_vu.createServer((Yeu_cau, Dap_ung) => {
  var Chuoi_Nhan = ""
  var Dia_chi_Xu_ly = Yeu_cau.url.replace("/", "")
  Yeu_cau.on('data', (chunk) => {
    Chuoi_Nhan += chunk
  }) //data: nhận dl từ client(như ajax)
  Yeu_cau.on('end', () => { //end: trả kq lại cho client

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