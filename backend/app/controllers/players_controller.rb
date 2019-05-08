class PlayersController < ApplicationController

  def index
    @all = Player.all
    render json: @all
  end

  def show
    @player = Player.find(params[:id])
    render json: @player
  end

  def create
    @player = Player.find_or_create_by(username: params["username"])
    render json: @player
  end
end
