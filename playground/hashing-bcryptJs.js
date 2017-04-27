const bcrypt = require('bcryptjs')

let password = 'random'
bcrypt.genSalt(20, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(err)
    console.log(hash)
  })
})

let hashedPassword = '$2a$10$gBE83vsmakd2OkYC.f//w.Rc.rF.JLeNxlnA07L0y5pPOd/NKjPoO'
bcrypt.compare(password,hashedPassword, (err,res) => {
  console.log(res);
})