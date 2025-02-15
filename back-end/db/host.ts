import IGame from '../interfaces/IGame.ts';
import { GameStates } from '../interfaces/IGameState.ts';
import Game from '../models/Game.ts'

const getAllGameIds = async (): Promise<number[]> => {
  try {
    const allGames = await Game.find({});
    return allGames.map(g => g.id);
  } catch (e) {
    console.error(`Issue getting all game ids: ${e}`);
    return [];
  }
};

const hostOpenGame = async (socketId: string): Promise<number> => {
  try {
    const allGameIds = await getAllGameIds();
    const maxId = allGameIds.length && Math.max(...allGameIds);
    const newId = maxId+1;
    const newGameObject: IGame = {
      id: newId,
      gameState: {
        state: GameStates.Lobby,
        message: ''
      },
      hostSocketId: socketId
    };

    const newGame = new Game(newGameObject);
    await newGame.save();

    return newId;
  } catch (e) {
    console.error(`Issue creating new game: ${e}`);
    return -1;
  }
};

const getGameData = async (gameId: number): Promise<IGame | null> => {
  try {
    const gameData = await Game.findOne({id: gameId});
    return gameData;
  } catch (e) {
    console.error(`Issue getting game data: ${e}`);
    return null;
  }
};

const moveGameToQuestionnaire = async (gameId: number): Promise<any> => {
  try {
    await Game.updateOne({id: gameId}, {
      $set: { 'gameState.state': 'questionnaire' }
    });
  } catch (e) {
    console.error(`Issue moving game to questionnaire: ${e}`);
  }
}

const deleteAllGames = async (): Promise<any> => {
  try {
    await Game.deleteMany({});
  } catch (e) {
    console.error(`Issue deleting all games: ${e}`);
  }
};

export default { getAllGameIds, hostOpenGame, deleteAllGames, getGameData, moveGameToQuestionnaire };
