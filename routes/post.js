let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let router = express.Router();


/* GET a create post page. */
router.get('/', util.isAuthenticated, (req, res, next) => {
    res.render('post', {
      name: req.session.steemconnect.name
    });
});

/* POST a create post broadcast to STEEM network. */
router.post('/create-postbody', util.isAuthenticated, (req, res) => {
    let author = req.session.steemconnect.name
    let permlink = util.urlString()
    var tags = req.body.tags.split(',').map(item => item.trim());
    let primaryTag = 'eureka'
    let otherTags = tags.slice(0)
    let title = req.body.title
    let file = req.body.file
    let filesize = req.body.filesize
    let filetype = req.body.filetype
    let filename = req.body.filename
    if(filetype.length > 3) {
    string = string.substring(0,2)
    }
    let linker = '[This ' + filetype + ' may be viewed at Eureka](https://?.app/eureka/' + author + '/' + permlink + ')';
    let customData = {
      tags: otherTags,
      app: 'eureka.app/v0.1.0',
      eurekaType: 'body',
      eurekaFile: filetype,
      eurekaSize: filesize,
      eurekaName: filename,
      eurekaHeader: linker.length
    }
    let body = linker + file;
    steem.comment('', primaryTag, author, permlink, title, body, customData, (err, steemResponse) => {
        if (err) {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Error - ${err}'
          })
        } else {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Posted To Steem Network'
          })
        }
    });
});

router.post('/create-post', util.isAuthenticated, (req, res) => {
    let author = req.session.steemconnect.name
    let permlink = util.urlString()
    var tags = req.body.tags.split(',').map(item => item.trim());
    let primaryTag = 'eureka'
    let otherTags = tags.slice(0)
    let title = req.body.title
    let body = req.body.post
    let meta = req.body.meta
    if (meta.split('/')[3] == 'ipfs') {
    meta = meta.split('/')[4];
    }
    let customData = {
      tags: otherTags,
      app: 'eureka.app/v0.1.0',
      eurekaIPFS: meta,
      eurekaType: 'IPFS'
    }
    steem.comment('', primaryTag, author, permlink, title, body, customData, (err, steemResponse) => {
        if (err) {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Error - ${err}'
          })
        } else {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Posted To Steem Network'
          })
        }
    });
});

/* POST a vote broadcast to STEEM network. */
router.post('/vote', util.isAuthenticatedJSON, (req, res) => {
    let postId = req.body.postId
    let voter = req.session.steemconnect.name
    let author = req.body.author
    let permlink = req.body.permlink
    let weight = 10000

    steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
      if (err) {
          res.json({ error: err.error_description })
      } else {
          res.json({ id: postId })
      }
    });
})

/* POST a comment broadcast to STEEM network. */
router.post('/comment',  util.isAuthenticatedJSON, (req, res) => {
    let author = req.session.steemconnect.name
    let permlink = req.body.parentPermlink + '-' + util.urlString()
    let title = 'RE: ' + req.body.parentTitle
    let body = req.body.message
    let parentAuthor = req.body.parentAuthor
    let parentPermlink = req.body.parentPermlink

    steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, '', (err, steemResponse) => {
      if (err) {
        res.json({ error: err.error_description })
      } else {
        res.json({
          msg: 'Posted To Steem Network',
          res: steemResponse
        })
      }
    });
});

module.exports = router;
