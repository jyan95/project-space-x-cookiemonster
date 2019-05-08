class GamesController < ApplicationController
  def index
    @all = Game.all
    render json: @all
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def create
    # byebug
    @game = Game.find_or_create_by(player_id: params["game"]["player_id"], score: params['game']['score'])
    render json: @game
  end

end
