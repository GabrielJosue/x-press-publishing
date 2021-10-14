const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');
// 16 
db.serialize( () => {
 db.run('DROP TABLE IF EXISTS Artist');
 db.run(' CREATE TABLE IF NOT EXISTS `Artist` (' + ' `id` integer not null  , ' +
 ' `name` text not null, ' +
 '`date_of_birth` text not null, ' +
 ' `biography` text not null, ' +
 ' `is_current_employed` integer not null default 1 ,' + 'primary key(`id`) )' );
// table series
db.run('CREATE TABLE IF NOT EXISTS `Series`(' + ' `id` integer not null,' +
       ' `name` text not null ,' +
       ' `description` text not null ,' +
       'primary key (`id`) )');
db.run('CREATE TABLE IF NOT EXISTS `Issue`('+' `id` integer not null,' +
       '`name` text not null,' +
       '`issue_number` integer not null ,' +
       '`publication_date` text not null ,' +
       '`artist_id` integer not null ,' +
       '`series_id` integer not null ,' +
       'PRIMARY KEY(`id`) ,' +
       'FOREIGN KEY (`artist_id`) REFERENCES `Artist`(`id`) ,' +
       'FOREIGN KEY (`series_id`) REFERENCES `Series`(`id`))');
}
)