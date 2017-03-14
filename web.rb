require 'sinatra'
require "sinatra/reloader" if development?
require 'mongoid'
require 'json/ext' # required for .to_json
require 'haml'
require 'uri'
require 'json'
require 'pp'
require 'csv'

Mongoid.load!("mongoid.yml", :production)

class SensorData
  include Mongoid::Document
  include Mongoid::Timestamps
  embeds_many :data_points
  accepts_nested_attributes_for :data_points

  field :time, type: DateTime
  field :phone_udid, type: String
  field :name, type: String
  field :smooth, type: Integer
end

class DataPoint
  include Mongoid::Document
  field :time, type: DateTime
  field :phone_udid, type: String

  field :longitude, type: Float
  field :latitude, type: Float
  field :speed, type: Float
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
  set :port, ENV["PORT"] || 9292
  set :bind, '0.0.0.0'
  set :public_folder, 'public'
end

get '/' do
  content_type :html
  data = SensorData.all.to_a
  haml :index, locals: {data: data}
end

get '/data/:id.json' do
  content_type :json
  sd = SensorData.find(params[:id])
  sd.to_json
end

get '/data/:id.csv' do
  sd = SensorData.find(params[:id])
  csv_string = CSV.generate do |csv|
    csv << DataPoint.fields.keys
    sd.data_points.each do |dp|
      csv << dp.attributes.values
    end
  end
end

get '/data/:id' do
  content_type :html


  sd = SensorData.find(params[:id])

  haml :show, locals: {sensordata: sd}
end


post '/save' do
  content_type :json
  body = JSON.parse(request.body.read)

  # Fix naming
  body['data_points'] = body['data']
  body.delete('data')

  s = SensorData.new(body)
  if s.save
    s.to_json
  else
    "Error saving doc"
  end
end

get '/script.js' do
  send_file File.join(settings.public_folder, 'script.js')
end

__END__

@@ layout
%html
  %head
    %script{src: "https://code.jquery.com/jquery-3.1.1.min.js"}
    -# %script{src: "https://d3js.org/d3.v4.min.js"}
    %script{src: "https://code.highcharts.com/highcharts.js"}
    %script{src: "https://code.highcharts.com/modules/data.js"}
    %script{src: "https://code.highcharts.com/modules/exporting.js"}
    %script{src: "https://www.highcharts.com/samples/static/highslide-full.min.js"}
    %script{src: "https://www.highcharts.com/samples/static/highslide.config.js", charset:"utf-8"}
    :css
      #container { width: 100%; }
      @media (min-width: 1100px) {
        #container > .chart { float: left; width: 50%; }
      }
  %body
    = yield

@@ index
#h1 Data collections
- data.each do |d|
  %dl
    %dt= d.time
    %dt= d.phone_udid
    %dt= d.name
    %dd
      %a{href: "/data/#{d.id}"}= d.id

@@ show
#h1= "#{ sensordata.time } - #{ sensordata.phone_udid }"
%a{href: "/data/#{sensordata.id}.json"} JSON
%a{href: "/data/#{sensordata.id}.csv"} CSV
#map{style: 'width:100%; height: 300px'}
  &nbsp;
#container
  &nbsp;
%script{src: "/script.js?cache=#{Time.now}"}
