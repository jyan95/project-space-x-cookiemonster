class GameSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :difficulty, :public_score

  has_one :player
end
