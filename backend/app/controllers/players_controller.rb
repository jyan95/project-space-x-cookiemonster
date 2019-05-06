class PlayersController < ApplicationController
  def show
    @player = Player.find(params[:id])
    render json: @player
  end
end
