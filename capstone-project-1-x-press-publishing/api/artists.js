const express = require('express');
const app = require('../server');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')
const artistRouter = express.Router();
artistRouter.get('/',(req,res,next)=>{
 db.all(` SELECT * FROM Artist where is_current_employed = 1`,(err,artists) => {
  if(err){
   next(err);
  }else{
   res.status(200).json({artists:artists});
  }
 });
})
artistRouter.param('artistId',(req,res,next,artistId)=>{
 const sql = 'SELECT * FROM Artist where Artist.id = $artistId';
 const values = {artistId:artistId};
 db.get(sql,values,(error,artist)=>{
  if (error) {
   next(error)
  } else if(artist) {
   req.artist = artist
   next();
  }else{
   res.sendStatus(404)
  }
 });
})
artistRouter.get('/:artistId',(req,res,next) =>{
 res.status(200).json({artist: req.artist})
});
// post
artistRouter.post('/',(req,res,next) => {
  const name = req.body.artist.name;
  const dateOfbirth = req.body.artist.dateOfbirth;
  const biography = req.body.artist.biography;
  const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed ===0 ? 0: 1
  if(!name || !dateOfbirth || !biography){
    return res.sendStatus(400);
  }
  // sql query
  const sql = 'INSERT INTO Artist(name,date_of_birth_birth,biography,is_current_employed) Values($name,$dateOfBirth,$biography,$isCurrentlyEmployed)'
 //  values
 const values = {
  $name:name,
  $dateOfBirth:dateOfbirth,
  $biography:biography,
  $isCurrentlyEmployed:isCurrentlyEmployed
 };
 // execute 
 db.run(sql,values,err =>{
   if (err) {
    next(err);
   }else{
    db.get(`SELECT *  FROM Artist WHERE Artist.id = ${this.LastID}`, (error,artist) => {
     res.sendStatus(201).json({artist:artist})
    }) 
   }
 })
})
// put 
artistRouter.put('/:artistId',(req,res,next) => {
  const name = req.body.artist.name;
  const dateOfbirth = req.body.artist.dateOfbirth;
  const biography = req.body.artist.biography;
  const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed ===0 ? 0: 1
  if(!name || !dateOfbirth || !biography){
    return res.sendStatus(400);
  }
  // sql query
  const sql = 'UPDATE Artist set name = $name , date_of_birth = $dateOfBirth,' +
  'biografy = $biography,is_current_employed  = $isCurrentlyEmployed' +
  ' Where Artist.id = artistId';
 // values
 const values = {
  $name: name,
  $dateOfBirth : dateOfbirth,
  $biography: biography,
  $isCurrentlyEmployed: isCurrentlyEmployed,
  $artistId: req.params.artistId
 };
 db.run(sql,values,(err) => {
  if(err){
   next(err);
  }else{
   db.get(`SELECT * FROM Artist where Artist.id = ${req.params.artistId}`,(error, artist) => {
     res.sendStatus(200).json({artist:artist})
   })
  }
 })
})
// delete
artistRouter.delete('/:artistId',(req,res,next) => {
// sql query
const sql = 'UPDATE Artist SET is_current_employed = 0  WHERE Artist.id = $artistId'
// values
const value = {$artistId:req.params.artistId}

// 
db.run(sql,value,(err) => {
 if(err){
  next(err);
 }else{
  db.get(`SELECT * FROM Artist where Artist.id = ${req.params.artistId}`,(error, artist) => {
     res.sendStatus(200).json({artist:artist})
   })
 }
})
 
})

module.exports = artistRouter;