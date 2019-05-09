class GameSerializer < ActiveModel::Serializer
  attributes :id, :player_id, :difficulty, :public_score, :created_at

  has_one :player
end
