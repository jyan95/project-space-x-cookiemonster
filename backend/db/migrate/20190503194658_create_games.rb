class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.integer :player_id
      t.integer :difficulty
      t.integer :public_score

      t.timestamps
    end
  end
end
