require 'sinatra'
require 'mongoid'
require 'json/ext' # required for .to_json
require 'uri'

Mongoid.load!("mongoid.yml", :production)

class SensorData
  include Mongoid::Document
  include Mongoid::Timestamps

  field :phone_udid, type: String

  field :longitude, type: Float
  field :latitude, type: Float
  field :accelerometerX, type: Float
  field :accelerometerY, type: Float
  field :accelerometerZ, type: Float
  field :gyroscopeX, type: Float
  field :gyroscopeY, type: Float
  field :gyroscopeZ, type: Float
  field :magnetometerX, type: Float
  field :magnetometerY, type: Float
  field :magnetometerZ, type: Float
  field :roll, type: Float
  field :pitch, type: Float
  field :yaw, type: Float
  field :rotationX, type: Float
  field :rotationY, type: Float
  field :rotationZ, type: Float
  field :gravityX, type: Float
  field :gravityY, type: Float
  field :gravityZ, type: Float
  field :userAccelerationX, type: Float
  field :userAccelerationY, type: Float
  field :userAccelerationZ, type: Float
  field :magneticFieldX, type: Float
  field :magneticFieldY, type: Float
  field :magneticFieldZ, type: Float
end

configure do
  set :root, File.dirname(__FILE__)
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
