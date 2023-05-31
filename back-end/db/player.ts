import * as uuid from 'uuid';
import IPlayer from '../interfaces/IPlayer.ts';
import { PlayerStates } from '../interfaces/IPlayerState.ts';
import Player from '../models/Player.ts'

const getPlayers = async (gameId: number): Promise<IPlayer[]> => {
  try {
    const players = await Player.find({gameId: gameId});
    return players;
  } catch (e) {
    console.error(`Issue getting player names: ${e}`);
    return [];
  }
};

const addPlayer = async (playerName: string, gameId: number): Promise<string> => {
  try {
    const playerId = `player_${uuid.v4()}`;
    const newPlayerObject: IPlayer = {
      name: playerName,
      id: playerId,
      questionnaireAnswers: [],
      quizGuesses: [],
      score: 0,
      gameId: gameId,
      playerState: {
        state: PlayerStates.JoinedWaiting,
        message: ""
      }
    }
    
    const newPlayer = new Player(newPlayerObject);
    await newPlayer.save();
    return playerId;
  } catch (e) {
    console.error(`Issue adding player: ${e}`);
    return '';
  }
};

const getPlayer = async (playerId): Promise<any> => {
  try {
    const player = await Player.findOne({id: playerId});
    return player;
  } catch (e) {
    console.error(`Issue getting player state: ${e}`);
  }
}

const deleteAllPlayers = async (): Promise<any> => {
  try {
    await Player.deleteMany({});
  } catch (e) {
    console.error(`Issue deleting all players: ${e}`);
  }
};

export default { getPlayers, addPlayer, deleteAllPlayers, getPlayer };
