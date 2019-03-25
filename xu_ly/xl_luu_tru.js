var File = require("fs")
var Thu_muc_Du_lieu = "du_lieu_luu_tru"
var Cong_nghe="json"

function Doc_Thong_tin_Dich_vu() {
  var Duong_dan = "index.html"
  var Chuoi_Thong_tin = File.readFileSync(Duong_dan, "UTF-8")
  return Chuoi_Thong_tin
}

function Doc_Thong_tin_Cua_hang() {
  var Duong_dan = Thu_muc_Du_lieu + "/Nha_hang/Nha_hang.json"
  var Chuoi_Thong_tin = File.readFileSync(Duong_dan, "UTF-8")
  return Chuoi_Thong_tin
}


class XL_LUU_TRU {
  
  Doc_Du_lieu(Loai_Doi_tuong) {
    var Danh_sach = []
    var Duong_dan = Thu_muc_Du_lieu + "//" + Loai_Doi_tuong
    var Danh_sach_Ten_Tap_tin = File.readdirSync(Duong_dan, "UTF-8")
    Danh_sach_Ten_Tap_tin.forEach(Ten => {
      if (Ten.toLowerCase().endsWith(Cong_nghe)) {
        var Chuoi = File.readFileSync(Duong_dan + "//" + Ten, "UTF-8")
        var Doi_tuong = JSON.parse(Chuoi)
        Danh_sach.push(Doi_tuong)
      }

    })
    return Danh_sach
  }
  Doc_Thong_tin_Dich_vu(){
    return Doc_Thong_tin_Dich_vu()
  }

  Doc_Thong_tin_Cua_hang(){
    return Doc_Thong_tin_Cua_hang()
  }

  Ghi_moi_Doi_tuong(Loai_Doi_tuong, Doi_tuong) {
    var Kq = ""
    try {
      var Duong_dan = Thu_muc_Du_lieu + "//" + Loai_Doi_tuong + "//" + Doi_tuong.Ma_so + "." + Cong_nghe
      var Chuoi = JSON.stringify(Doi_tuong, null, "\t")
      File.writeFileSync(Duong_dan, Chuoi, "UTF-8")
    } catch (Loi) {
      Kq = Loi
    }

    return Kq
  }

}



//Public để các file js khác gọi 
var Xu_ly = new XL_LUU_TRU
module.exports = Xu_ly




