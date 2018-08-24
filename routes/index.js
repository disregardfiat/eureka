let express = require('express');
let router = express.Router();
let request = require('request');
/* GET home page. */
router.get('/', (req, res, next) =>  {
  if(req.session.steemconnect){
    res.redirect(`/@${req.session.steemconnect.name}`)
  } else {
    res.render('index', { title: 'SteemConnect Boilerplate' });
  }
});

/* GET a users blog profile page. */
router.get('/@:username', (req, res, next) => {
      let username = req.params.username
      res.render('profile', {
        username: username
      });
});

/* GET a users blog feed page. */
router.get('/@:username/feed', (req, res, next) => {
      let username = req.params.username
      res.render('feed', {
        feed: 'user-feed',
        username: username
      });
});

/* GET a users transfers profile page. */
router.get('/@:username/transfers', (req, res, next) => {
      let username = req.params.username
      res.render('transfers', {
        username: username,
        user: req.session.steemconnect ? req.session.steemconnect.name : ''
      });
});

/* GET a single post page page. */
router.get('/:category/@:username/:permlink', (req, res, next) => {
      let category = req.params.category
      let permlink = permlink
      let username = username
      let title = 'Eureka'
      let description = 'Blockchain Monetized Academic Review'
      let image = 'https://ipfs.io/ipfs/QmQ84g5YwraX1cF87inZut2GaQiBAFaKEHsUaYT44oTs9h'
      function render() {
        res.render('single', {
          category: category,
          permlink: permlink,
          OGtitle: title,
          OGdescription: description,
          OGimage: image,
        });
      }
      function renderB() {
        res.render('binary', {
          category: category,
          permlink: permlink,
          OGtitle: title,
          OGdescription: description,
          OGimage: image,
          binary: description
        });
      }
        try {
          var dataString = '{"jsonrpc":"2.0", "method":"condenser_api.get_content", "params":["' + username + '", "' + permlink + '"], "id":1}';
          var options = {
          url: 'https://api.steemit.com',
          method: 'POST',
          body: dataString
          };
          request(options, function(err, res, body) {
            var html = json.result.body
            var headerLength = JSON.parse(result.content[post].json_metadata).eurekaHeader
      if (JSON.parse(result.content[post].json_metadata).eurekaType == 'body') {
      html = html.substring(headerLength, html.length - headerLength)
      }
            let json = JSON.parse(body);
            title = json.result.title
            description = json.result.body
            var metadata = json.result.json_metadata
            let eurekaType = JSON.parse(metadata).eurekaType
            let eurekaHeader = JSON.parse(metadata).eurekaHeader
            if (eurekaType === 'body') {
              description = description.substring(headerLength, description.length - headerLength)
              renderB();
            } else {
              render()
            }
          });
        } catch (e) {
          console.log('API error(vanillia template served):\n' + e)
          render()
        }
      });
module.exports = router;
