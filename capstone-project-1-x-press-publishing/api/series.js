const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')
const issuesRouter = require('./issues');
const seriesRouter = express.Router();

seriesRouter.get('/',(req,res,next) => {
 db.all('select * from Series',(err,series) => {
  if(err){
   next(err);
  }else{
   res.status(200).json({series:series})
  }
 })
})
// params
seriesRouter.param('seriesId',(req,res,next,seriesId) => {
// sql query
const sql = 'SELECT * FROM Series Where Series.id = $seriesId'
// value 
const value = {$seriesId:seriesId}
//execute
db.run(sql,value,(err,series) => {
 if(err){
  next(err);
 }else if(series){
  req.series = series
  next();
 }else{
  res.sendStatus(404);
 }
})
})
// get series
seriesRouter.get('/:seriesId',(req,res,next) => {
 res.status(200).json({series:req.series})
 
})
// post series
seriesRouter.post('/',(req,res,next) => {
 const name = req.body.series.name;
 const description = req.body.series.description
 
 
 // missing fields
 if(!name || !description){
  return res.sendStatus(400)
 }
 //sql query
 const sql = 'Insert Into Series(name,description) values($name,$description)'
 // values
 const values = {
  $name:name,
  $description:description
 }
 // execute
 
 db.run(sql,values,(err,serie) => {
  if(err){
   next(err)
  }else{
   db.get(`select * from Series where Series.id = ${this.LastID}`,(err,series) =>{
    res.status(201).json({series:series})
   })
   
  }
 })
 
})
// put series
seriesRouter.put('/:seriesId',(req,res,next) => {
 const name = req.body.series.name;
 const description = req.body.series.description
 
 
 // missing fields
 if(!name || !description){
  return res.sendStatus(400)
 }
 //sql
 const sql = 'UPDATE Series set name = $name ,' + 
             'description = $description ' + 
             'where Series.id = seriesId'
 const values ={
  $name:name,
  $description:description,
  $seriesId: seriesId
 }
 //execute 
 db.run(sql,values,err =>{
  if(err){
   next(err);
  }else{
   db.get(`select * from Series where Series.id = ${req.params.seriesId}`,(err,series) =>{
    res.status(200).json({series:series})
   })
  }
 })
})
//delete series
seriesRouter.delete('/:seriesId',(req,res,next) => {
 const issueSql = 'select * from Issue where Issue.series_id = $seriesId'
 //values
 const issueValue ={$seriesId:req.params.seriesId};
 db.get(issueSql,issueValue,(err,issue )=>{
  if(err){
   next(err);
  }else if(issue){
  res.sendStatus(400);
  }else{
   const sql = 'delete from Series where Series.id = $seriesId'
   const value = {$seriesId:req.params.seriesId};
   //execute 
   db.run(sql,value,err =>{
    if(err){
     next(err);
    }else{
     res.sendStatus(204);
    }
   })
  }
 })
})
module.exports = seriesRouter;