require 'sinatra'
require 'mongoid'
require 'json/ext' # required for .to_json

class SensorData
  include Mongoid::Document
  include Mongoid::Timestamps

  field :phone_udid, type: String

  field :longitude, type: Double
  field :latitude, type: Double
  field :accelerometerX, type: Double
  field :accelerometerY, type: Double
  field :accelerometerZ, type: Double
  field :gyroscopeX, type: Double
  field :gyroscopeY, type: Double
  field :gyroscopeZ, type: Double
  field :magnetometerX, type: Double
  field :magnetometerY, type: Double
  field :magnetometerZ, type: Double
  field :roll, type: Double
  field :pitch, type: Double
  field :yaw, type: Double
  field :rotationX, type: Double
  field :rotationY, type: Double
  field :rotationZ, type: Double
  field :gravityX, type: Double
  field :gravityY, type: Double
  field :gravityZ, type: Double
  field :userAccelerationX, type: Double
  field :userAccelerationY, type: Double
  field :userAccelerationZ, type: Double
  field :magneticFieldX, type: Double
  field :magneticFieldY, type: Double
  field :magneticFieldZ, type: Double
end

configure do
  database = ENV['MONGODB_URL'] || 'mongodb://localhost:27017/savedata'
  set :root, File.dirname(__FILE__)

  Mongoid.configure do |config|
    config.master = Mongo::Connection.new.db(database)
    #config.logger = Logger.new($stdout, :warn)
    config.logger = logger
    config.persist_in_safe_mode = false
  end

  set :mongo_db, db[database[0].to_sym]
end

set :port, ENV["PORT"] || 5000

get '/' do
  content_type :json
  SensorData.all.to_a.to_json
end

post '/save' do
  content_type :json
  db = settings.mongo_db
  result = db.insert_one params

  s = SensorData.new(params[:task])
  if s.save
    s.to_json
  else
    "Error saving doc"
  end
end
