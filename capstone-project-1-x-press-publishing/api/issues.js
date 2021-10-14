const express = require('express');
const sqlite3 = require('sqlite3');
const issuesRouter = express.Router({mergeParams:true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

//params
issuesRouter.param('issueId',(req,res,next,issueId)=>{
 // sql query 
 const sql = 'select * from Issue where Issue.id = $issueId'
 //value
 const value = {$issueId:issueId}
 // execute
 db.run(sql,value,(err,issue) =>{
   if (err) {
    next(err)
   }else if(issues){

    next();
   }else{
    res.sendStatus(404);
   }
 })
})
//get issues
issuesRouter.get('/',(req,res,next) => {
   //sql issue
   const sql = 'select * from Issue where Issue.series_id = $seriesId';
   //values
   const values = {$seriesId = req.params.seriesId}
   db.all(sql,values,(err,issues) =>{
    if(err){
     next(err)
    }else{
     res.status(200).json({issues:issues})
    }
   })
})
//post issues
issuesRouter.post('/',(req,res,next) => {
  const name = req.body.issue.name;
  const issueNumber = req.body.issue.issuesNumber
  const publicationDate = req.body.issue.publicationDate
  const artistId = req.body.issue.artistId
   // sql artist
  const artistSql = 'select * from Artist where Artist.id = $artistId'
  // Artist values
  const artistValue = {$artistId:artistId}
  //execute
  db.get(artistSql,artistValue,(err ,artist)=>{
   if(err){
    next(err);
   }else{
    if(!name || !issueNumber || !publicationDate || !artist){
   return res.sendStatus(400);
  }
     // sql query
  const sql = 'INSERT INTO Issue(name,issue_number,publication_date,artist_id,series_id) values($name,$issueNumber,$publicationDate,$artistId,seriesId) '
  //values
  const values = {
   $name:name,
   $issueNumber:issueNumber,
   $publicationDate:publicationDate,
   $artistId:artistId,
   $seriesId:seriesId
  };

   //execute
  db.run(sql,values,err =>{
   if(err){
    next(err);
   }else{
    db.get(`select * from Issue where Issue.id = ${this.lastID}`,(err,issue)=>{
     res.status(201).json({issue:issue})
    })
   }
  })
   }
  })
  
 
  
 
})

// put issues
issuesRouter.put('/:issueId',(req,res,next) => {
const name = req.body.issues.name;
  const issueNumber = req.body.issues.issuesNumber
  const publicationDate = req.body.issues.publicationDate
  const artistId = req.body.issues.artistId
  // sql artist
  const artistSql = 'select * from Artist where Artist.id = $artistId'
  // Artist values
  const artistValue = {$artistId:artistId}
  //execute
  db.get(artistSql,artistValue,(err ,artist)=>{
   if(err){
    next(err);
   }else{
    if(!name || !issueNumber || !publicationDate || !artist){
   return res.sendStatus(400);
    }
    // sql query
  const sql = 'update Issue set name =$name,' +
              'issue_number = $issueNumber' + 
              'publication_date = $publicationDate' +
              'artist_id =$artistId' +
              'where Issue.id = $issueId'
  // values
  const values ={
   $name:name,
   $issueNumber:issueNumber,
   $publicationDate :publicationDate,
   $artistId :artistId,
   $issueId :req.params.issueId
  };
  //execute
  db.run(sql,values,err =>{
   if (err) {
    next(err);
   }else{
    db.get(`select * from Issue where Issue.id = ${req.params.issueId}`,(err,issue) =>{
     res.status(200).json({issue:issue})
    })
   }
  })
     
  }
   })
    
})
// delete 
issuesRouter.delete('/:issueId',(req,res,next) => {
 const sql = 'delete from Issue where Issue.id =$issueId'
 const value = {$issueId:req.params.issueId}
 //execute
 db.run(sql,value,err =>{
  if(err){
   next(err);
  }else{
   res.sendStatus(204);
  }
 })
});
  
module.exports = issuesRouter;