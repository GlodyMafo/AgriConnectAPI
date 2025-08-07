const passport = require('passport');

const router = require ('express').Router();

router.use('/',require('./swagger'))

router.get('/',(req,res)=>{
    res.send("Welcome to AGRICONNECT")
})

// router.get('/', (req, res) => {

//   res.send(req.isAuthenticated() ? `logged in as ${req.user.username}` : 'logged out');
// });

// router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// router.get('/github/callback',
//   passport.authenticate('github', { failureRedirect: '/api-docs' }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );


// router.get('/login', passport.authenticate('github'), (req, res)=>{})

// router.get('/logout', (req, res, next)=>{
//     req.logout(function(err){
//         if(err){
//             return next(err);
//         }
//         res.redirect('/')
//     })
// })

router.use('/products', require('./products'));
router.use('/users', require('./users'));

module.exports=router;