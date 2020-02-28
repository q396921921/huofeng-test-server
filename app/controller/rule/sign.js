exports.createUser = {
  phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3456789]\d{9}$/  },
  password: { type: 'string', require: true, allowEmpty: false }
}