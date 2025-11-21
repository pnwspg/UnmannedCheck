const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  year: Number,                        // ปี พ.ศ. / ค.ศ.
  status: {                            // สถานะการจ่ายไฟของปีนี้
    type: String,
    enum: ['จ่ายไฟ', 'ยกเลิกการจ่ายไฟ', 'มีแผนจ่ายไฟ'],
    default: 'มีแผนจ่ายไฟ'
  },
  staffCount: Number,
  staffNames: [String]
}, { _id: false });

const substationSchema = new mongoose.Schema({
  // ผูกกับ user regionCode
  regionCode: {
    type: String,
    enum: ['n1','n2','n3','ne1','ne2','ne3','c1','c2','c3','s1','s2','s3'],
    required: true
  },

  // แสดงในตาราง: กฟน.1/กฟฉ.1 ฯลฯ จะคำนวณใน frontend ตาม regionCode ก็ได้
  // หรือเก็บเลยก็ได้
  regionName: { type: String },

  managementUnit: String,              // หน่วยจัดการงานสถานีไฟฟ้า
  operationUnit: String,               // หน่วยปฏิบัติงานสถานีไฟฟ้า
  unmannedSubstation: String,          // ชื่อสถานีไฟฟ้า Unmanned

  costCenters: [String],               // รหัสศูนย์ต้นทุน (หลายค่า)

  operationType: {                     // dropdown
    type: String,
    enum: ['Fully Unmanned Substation', 'Partially Unmanned Substation']
  },

  status2568: {                        // dropdown
    type: String,
    enum: ['จ่ายไฟ','ยกเลิกการจ่ายไฟ','มีแผนจ่ายไฟ']
  },

  employees2568Count: Number,          // จำนวนพนักงานในปี 2568
  employees2568Names: [String],        // รายชื่อ

  // แผนการจ่ายไฟปี XXX (หลายปี)
  plans: [planSchema]
}, { timestamps: true });

module.exports = mongoose.model('Substation', substationSchema);
