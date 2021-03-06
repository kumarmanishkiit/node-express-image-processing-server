var express = require('express');
var router = express.Router();

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'Pizza.' + filetype);
    }
});
var upload = multer({storage: storage});

router.post('/upload',upload.single('file'),function(req, res, next) {
    console.log(req.file);
    if(!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({ fileUrl: 'http://192.168.0.7:3000/images/' + req.file.filename });
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET Image. */
router.get('/getImage', function(req, res, next) {
    var options = {
        root: './public/images/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'Cache-Control': 'public, max-age=0, no-cache, no-store, must-revalidate, proxy-revalidate'
        }
    }
    
    var fileName = 'Pizza.png'
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
        }
    })
});

module.exports = router;
