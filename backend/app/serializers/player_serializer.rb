class PlayerSerializer < ActiveModel::Serializer
  attributes :id, :username

  has_many :games
end
