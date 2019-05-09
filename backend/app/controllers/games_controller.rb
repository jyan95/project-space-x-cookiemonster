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
    @game = Game.create(player_id: params["player_id"], public_score: params["public_score"])
    render json: @game
  end

end
