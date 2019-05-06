class GamesController < ApplicationController
  def index
    @all = Game.all
    render json: @all
  end
end
