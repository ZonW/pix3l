# pix3l-server
pix3l server
Base url: www.pix3l.art/api

GET "/generate"
eg: http://www.pix3l.art/api/generate?style=future-architecture-generator&text=panda
param: style, text
validStyles : future-architecture-generator, fantasy-world-generator, stable-diffusion

GET "/gallery"
eg: http://www.pix3l.art/api/gallery

POST "/addImage"
eg: http://www.pix3l.art/api/addImage
Body: {
    "userId": "User FirebaseId",
    "imageId": "1576e89e-1da7-4200-81bf-77a92a8ae729",
    "style": "fantasy-world-generator",
    "text": "Cyberpunk panda"
}

GET "/deleteCache"
eg: http://www.pix3l.art/api/deleteCache

GET "/getUser/:firebaseId"
eg: http://www.pix3l.art/api/getUser/qwerqwer

POST "/newUser/:firebaseId"
eg: http://www.pix3l.art/api/newUser/qwerqwer