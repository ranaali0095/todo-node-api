const {SHA256} = require('crypto-js')

let message = 'I am user no three'

let hash = SHA256(message).toString()

console.log(`Hash  ${hash}`)

//data was created
let data = {
  id: 4,
}

//create token by hashing data + random salt
let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somerandomstring').toString(),
}

//*************************
// Tried to change data in between client and server

token.data.id = 5
// Without knowing salt hacker cannot generate correct result hash
token.hash = SHA256(JSON.stringify(data)).toString()

//************************

//create hash on server to verify data wasn't changed
let resultHash = SHA256(JSON.stringify(token.data) + 'somerandomstring').
  toString()

if (resultHash === token.hash) {
  console.log('Data was not changed')
} else {
  console.log('Data was changed. Do not trust')
}