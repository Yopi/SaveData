require 'sinatra'

set :port, ENV["PORT"] || 5000

get '/' do
  "Test"
end
