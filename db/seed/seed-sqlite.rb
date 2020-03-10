#!/usr/bin/env ruby

require 'sqlite3'
require 'csv'

COLUMNS = {
    restaurant_name: 'varchar(100)',
    mon: 'varchar(100)',
    tue: 'varchar(100)',
    wed: 'varchar(100)',
    thu: 'varchar(100)',
    fri: 'varchar(100)',
    sat: 'varchar(100)',
    sun: 'varchar(100)'
}

db = SQLite3::Database.new '../hours.sqlite3'

res = db.execute 'SELECT name FROM sqlite_master WHERE type = "table"'

if res.flatten.include?('entries')
  puts 'table `entries` already exists — dropping'
  db.execute 'DROP TABLE entries'
end

columns = COLUMNS.inject('') do |memo, pair|
  name, type = pair
  memo += "\n#{name} #{type},"
end.chomp(',')

db.execute <<-SQL
  create table entries (
    #{columns}
  );
SQL

print "\nWorking..."

dir = File.dirname(File.expand_path(__FILE__))
lineno = 1
CSV.foreach(File.join(dir, 'processed-hours.csv'), {:encoding => 'ISO8859-1'}) do |row|
  lineno = $.
  # print row
  # print "\n"
  # next if lineno == 1
  print '.' if lineno % 1000 == 0

  # Humanize descriptions
  row[1] = row[1].capitalize.gsub(/([\,\/])\s*/, '\1 ').gsub(/\s*\&\s*/, ' \1 ')

  sql = <<-SQL
    INSERT INTO entries (#{COLUMNS.keys.join(', ')})
    VALUES (#{(['?'] * COLUMNS.size).join(', ')})
SQL
  db.execute sql, row
end

print "done."
print "\n#{lineno} entries imported."
