require 'sinatra'
require 'mongo'
require 'json/ext' # required for .to_json

configure do
  database = ENV['MONGODB_URL'] || 'mongodb://localhost:27017/savedata'
  db = Mongo::Client.new([database[1]], :database => database[0])
  set :mongo_db, db[database[0].to_sym]
end

set :port, ENV["PORT"] || 5000

get '/' do
  content_type :json
  settings.mongo_db.find.to_a.to_json
end

post '/save' do
  content_type :json
  db = settings.mongo_db
  result = db.insert_one params
  db.find(:_id => result.inserted_id).to_a.first.to_json
end
